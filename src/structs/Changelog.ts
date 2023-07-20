import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { git } from '@/util/git';
import { match } from '@/util/match';
import { existsSync, statSync, writeFileSync } from 'fs';
import { dirname } from 'path';

import * as schemas from '@/schemas';
import * as regex from '@/util/regex';

import type { Object as Config } from '@/schemas/config';
import type { BaseLog, ConventionalLog, Log } from '@/types/Log';
import type { Release } from '@/types/Release';
import type { ReadonlyDeep } from 'type-fest';

export abstract class Changelog {
  /**
   * Generates a link to compare two tags.
   *
   * @param URL The base URL of the git repository.
   * @param previous The previous tag.
   * @param current The current tag.
   * @returns The generated link to compare the two provided tags.
   */
  public static GenerateCompareLink(URL: string, previous: string, current: string): string {
    return `${URL}/compare/${previous}...${current}`;
  }

  /**
   * Generates a link to a commit.
   *
   * @param URL The base URL of the git repository.
   * @param log The log to generate a link for.
   * @returns The generated link to the commit.
   */
  public static GenerateHashLink(URL: string, log: Log): string {
    return `<code>[${log.short_hash}](${URL}/commit/${log.hash})</code>`;
  }

  /**
   * Converts logs from simple-git to a format that respects the conventional
   * commit specification.
   *
   * When using the simple-git library to get logs, by default, it returns an
   * object representing information about a commit, such as the author, date,
   * and more importantly, the commit message. Here in this object, the message
   * is a string, which is not ideal for parsing.
   *
   * Commit messages may be specified within the conventional commit
   * specification, which is a format that is used to standardize commit
   * messages. This method will take in a log from simple-git and convert the
   * message to an object that respects the conventional commit specification.
   * @param log The log to convert.
   * @returns The converted log.
   */
  public static Convert(log: BaseLog): Log {
    const groups = match(regex.CONVENTIONAL_COMMIT, log.message);

    if (!groups) {
      return log;
    }

    return { ...log, message: { ...groups, type: groups.type!, breaking: groups.breaking !== undefined } };
  }

  /**
   * Gets the HTTPS URL of the git repository.
   *
   * `URL` attempts to find the HTTPS URL of the git repository, this is done by
   * the `git remote get-url origin` command and parsing the output.
   *
   * The issue with this is that a git repository may either be cloned using
   * HTTPS or SSH, if cloned by HTTPS, this command will simply return the URL.
   * If cloned by SSH, the command will return a string similar to:
   * ```
   * git@<host>:<owner>/<repo>.git
   * ```
   * In this case, the URL is generated by parsing the respective values from
   * this string.
   * @returns The base URL of the git repository.
   * @throws A `BumpError` error with the code `INVALID_GIT_URL` if the client
   * fails to get the URL of the repository, note that while this error is
   * thrown, it doesn't necessarily mean that the directory isn't a valid git
   * repository.
   */
  public static async GitURL(): Promise<string> {
    // Initially, we'll use the client to run the `git remote get-url origin`
    // command, which will return either a HTTPS or SSH URL for the repository.
    const url: string | void = await git.remote(['get-url', 'origin']);

    if (!url) {
      throw new BumpError(ErrorCodes.NOT_A_GIT_REPOSITORY);
    }

    // If a string is returned, we'll check if the string is a valid URL, if so,
    // we'll return the URL as is.
    else if (schemas.Link.safeParse(url).success) {
      return url;
    }

    // Otherwise, we'll need to parse the needed values from the SSH URL. This
    // is done by using a regular expression and the `match` function, which
    // will return an object containing the groups from the regular expression.
    const groups = match(regex.git.SSH_URL, url)!;

    return `https://${groups.host}/${groups.owner}/${groups.repo}`;
  }

  /**
   * Groups a collection of logs by their respective release.
   *
   * Commits may be associated with a tag, for the purpose of generating a
   * changelog, we will treat each tag as a release. From the provided
   * collection of logs, this method will group logs by their respective tag.
   * @param logs The collection of logs to group.
   * @param config The configuration object.
   * @returns A dictionary referencing each release, where the key represents
   * a specific release and the value referencing information of that release.
   */
  public static GroupByRelease(logs: Readonly<BaseLog[]>, config: ReadonlyDeep<Config>): Record<string, Release> {
    const releases: Record<string, Release> = {};

    // References the current version to push logs into during the iteration.
    // Initially, this will be set to the unreleased header as we'll be
    // iterating through logs in a descending order.

    // During iteration, when a log is found to have a tag, this reference will
    // be set to the new tag, with future logs being pushed into the new tag.
    let version: string = config.unreleasedHeader;

    for (const baseLog of logs) {
      // In addition, we'll convert the base log into a log that references
      // information of the commit's subject if it is in a conventional format.
      const log: Log = Changelog.Convert(baseLog);

      const tag = match(regex.git.TAG, baseLog.refs);

      // If the current commit has a tag, we'll create a new release for the
      // version within the container and update the version reference.
      if (tag?.version) {
        version = tag.version;
        releases[tag.version] = { ...log, commits: [], version: tag.version } as Release;
      }

      // Otherwise, we'll push the commit into the current version.
      else if (releases[version]) {
        releases[version].commits.push(log);
      }

      // If the current version does not an entry within the container, we'll
      // initialize a new release. This condition should only be met once if the
      // first commit does not have a tag.
      else {
        releases[version] = { commits: [log], version: version };
      }
    }

    return releases;
  }

  /**
   * Groups logs by their respective type.
   *
   * Logs may be in a conventional format, meaning the commit's subject follows
   * a specific format that defines important information regarding the commit.
   * From this format, we can group logs by their respective type, constructing
   * an object for each type, referencing the type's respective logs and
   * options, if any.
   *
   * If a log is not in a conventional format, that is the subject is simply a
   * string, these are instead grouped into a separate array.
   *
   * @param logs The collection of logs to group.
   * @returns An object referencing the various types within the collection of
   * logs.
   */
  private static GroupLogsWithType(logs: Log[]): { types: Map<string, ConventionalLog[]>; none: BaseLog[] } {
    const collection: Map<string, ConventionalLog[]> = new Map();

    // In addition to referencing logs with a specific type, we'll also
    // want to reference logs that are not in a conventional format.
    const nonConventionalLogs: BaseLog[] = [];

    for (const log of logs) {
      if (typeof log.message === 'string') {
        nonConventionalLogs.push(log as BaseLog);
      } else {
        if (!collection.has(log.message.type)) {
          collection.set(log.message.type, [log as ConventionalLog]);
        } else {
          collection.get(log.message.type)?.push(log as ConventionalLog);
        }
      }
    }

    return { types: collection, none: nonConventionalLogs };
  }

  /**
   * Converts a log into a string.
   *
   * A `Log` instance holds important information regarding a commit, such as
   * the commit's message, body, and hash, in addition to the commit's subject
   * in a conventional format.
   *
   * Using these various information, this method will convert the log into a
   * string to reflect these values.
   * @param log The log to convert to a string.
   * @param url The base URL of the git repository.
   * @param config The configuration object, which will be used to determine
   * whether or not to include the body of the commit.
   * @returns The log converted to a string.
   */
  private static LogToString(log: Log, url: string, config: ReadonlyDeep<Config>): string {
    const hash: string = Changelog.GenerateHashLink(url, log);

    // The container for the lines that represent the log converted to a string.
    // As we'll also want to, optionally, include the commit's body, we'll need
    // to initialize a container to reference the various lines.
    const lines: string[] = [];

    // If the commit's message is not in a conventional format, we don't have a
    // lot of information, so we'll simply print the commit's message.
    if (typeof log.message === 'string') {
      lines.push(`- ${log.message} ${hash}`);
    }

    // If the commit's message is in a conventional format, we'll want to
    // include all necessary information within the string. We'll initially
    // include information of the commit itself within a container.
    else {
      lines.push(`- ${log.message.scope ? `**${log.message.scope}**: ` : ''}${log.message.description} ${hash}`);
    }

    if (config.includeBody && log.body.length > 0) {
      // When printing the body of the commit, we'll want to indent each line
      // to match the indentation of the commit's message, so we'll need to
      // split the body into lines and indent each line accordingly.
      const bodyLines: string[] = log.body.split('\n');

      lines.push('\n');
      for (const line of bodyLines) {
        lines.push(`\t${line}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Generates a section for a release.
   *
   * This method implements the logic for generating a section within the
   * changelog for a given release. A given section will include the release's
   * - version
   * - date, if the section represents a release
   * - a comparison link to the previous release, if it exists
   * - a list of commits associated with the release grouped by their
   * respective type and scope
   * @param releases The collection of releases to reference when generating the
   * section. Note that `release.current` represents the main release that is
   * being generated, while `release.previous` represents the next release
   * within the iteration. As commits are iterated in a descending order, this
   * will be the previous release.
   * @param config The configuration object.
   * @returns The generated section.
   */
  private static async GenerateSection(releases: { current: Release; previous: Release | undefined }, config: ReadonlyDeep<Config>): Promise<string> {
    const lines: string[] = [];

    const { current, previous } = releases;

    // The base HTTPS URL of the git repository. Using the `git remote get-url`
    // command, we're able to determine to construct the URL no matter which
    // platform the repository is hosted on.
    const url: string = await Changelog.GitURL();

    // Initially, we'll generate the header for the release, this will
    // essentially be the version of the release, however, we'll also want to
    // include the date and a comparison link if the next release is defined.

    // First, we'll check if the current release has a date, if not, it
    // represents commits that have not been released yet, therefore, we'll
    // simply print the release's respective version.
    if (!current.date) {
      lines.push(`## ${current.version}\n`);
    }

    // Next, as we know the current release has a version, we'll check if there
    // is a previous release following the current release. If so, we'll want to
    // generate a comparison link between the two releases.
    else if (previous?.version) {
      lines.push(`## [${current.version}](${Changelog.GenerateCompareLink(url, previous.version, current.version)}) (${current.date})\n`);
    }

    // Finally, if there is no release following the current release, we'll
    // simply print the current's respective version and date.
    else {
      lines.push(`## ${current.version} (${current.date})\n`);
    }

    // After the header, we'll generate the body of the section, which will
    // consist of the commits associated with the release. When generating the
    // respective commits, we'll want to group them under their respective types
    // as specified by commits in a conventional format.

    // We'll initialize a container that will reference the various types along
    // with their commits and options as specified by the configuration object.
    const groups = Changelog.GroupLogsWithType(current.commits);

    // When generating the body of the section, we'll first want to print any
    // commits that are not in a conventional format, as these commits can't be
    // grouped under a type.

    // These commits will simply be printed as is, under the section's title.
    if (config.includeNonConventionalCommits && groups.none.length > 0) {
      for (const log of groups.none) {
        lines.push(`${Changelog.LogToString(log, url, config)}\n`);
      }
    }

    // Next, we'll want to print commits that are in a conventional format. From
    // the `GroupLogsWithType` method, we have grouped every commit under their
    // respective type.

    // We'll iterate through each type and print every commit associated with
    // that type as a list under the type's title.
    for (const type of groups.types.keys()) {
      const logs: ConventionalLog[] = groups.types.get(type)!;

      // Users may specify options for a given type, such as whether if the type
      // should be hidden or not or if the type should be renamed. We'll attempt
      // to find the type's respective options, if they exist.
      const options = config.types?.find((t) => t.type.toLowerCase() === type.toLowerCase());

      if (options?.hidden) {
        continue;
      }

      lines.push(`### ${options?.name ?? type}\n`);

      // Before pushing the commits, we'll want to sort them by their scope, if
      // specified. This will ensure that commits with a scope will be grouped
      // together within the changelog, rather than being scattered throughout.
      logs.sort((a, b) => {
        if (a.message.scope && b.message.scope === undefined) {
          return 1;
        } else if (a.message.scope === undefined && b.message.scope) {
          return -1;
        } else if (a.message.scope && b.message.scope) {
          return a.message.scope.localeCompare(b.message.scope);
        }

        return 0;
      });

      for (const log of logs) {
        lines.push(`${Changelog.LogToString(log, url, config)}\n`);
      }
    }

    // Once all logs have been parsed and pushed, the `lines` array will
    // reference the body of the section. However, we'll implement a check to
    // ensure whether if the section should be printed if empty.

    // Within the changelog, sections represents a specific release, thus, the
    // only time a section should not be printed is if the section represents
    // unreleased commits. If the section represents unreleased commits and
    // there are no commits to print, which is determined by the length of the
    // `lines` array, we'll simply return an empty string.
    if (!current.date && lines.length === 1) {
      return '';
    }

    // Once the body for the section has been generated, we'll want to translate
    // all references to issues to links, which will allow users to easily
    // navigate to the respective issue.

    // Issues are referenced in the format of `#<id>`, so we'll simply need to
    // convert the reference to a link as `<URL>/issues/<id>`.
    const string: string = lines.join('\n').replace(new RegExp(regex.ISSUES, 'g'), (_, issueNumber) => {
      return `[#${issueNumber}](${url}/issues/${issueNumber})`;
    });

    return string;
  }

  /**
   * Generates a markdown-formatted changelog for the git repository where the
   * command is executed.
   *
   * `Generate` uses the `simple-git` library to retrieve information of each
   * commit within the repository. The commits are then grouped by their
   * respective release and parsed into a markdown-formatted string representing
   * the changelog.
   * @param config The configuration object containing configuration values for
   * altering how the changelog is generated.
   * @returns A markdown-formatted string representing the generated changelog.
   * @throws A `BumpError` with the `NOT_A_GIT_REPOSITORY` error code if the
   * current working directory is not a git repository.
   */
  public static async GenerateString(config: ReadonlyDeep<Config>): Promise<string> {
    if (!(await git.checkIsRepo())) {
      throw new BumpError(ErrorCodes.NOT_A_GIT_REPOSITORY);
    }

    // By using the `simple-git` library, it makes it trivial to retrieve all
    // commits within the repository. We're able to import all commits and
    // format each commit to our liking.

    // Here, we'll import all commits and format them to include the important
    // information we'll need to specify within the changelog.
    const logs = await git.log({
      format: {
        hash: '%H',
        date: '%ad',
        message: '%s',
        refs: '%D',
        body: '%b',
        author_name: '%aN',
        author_email: '%aE',
        short_hash: '%h',
      },

      '--date': 'short',
    });

    // From this collection of logs, we'll want to group them by their
    // respective release. This will allow us to easily generate a section for
    // each release.

    // Each key/value pair will represent a specific release with the value
    // representing the respective release's information, such as all commits.
    const releases: Record<string, Release> = Changelog.GroupByRelease(logs.all, config);

    // Once we have grouped the logs by their respective release, we'll want to
    // then generate the changelog. The changelog is essentially a collection of
    // sections, with each section representing a specific release.

    // As `releases` is a dictionary, we'll initialize an array of each release
    // to simplify iterating through each release.
    const versions: string[] = Object.keys(releases);

    const sections: string[] = [];

    // For each release, we'll generate a string representing the section for
    // that release and append it within the final generated changelog.
    for (let i = 0; i < versions.length; i++) {
      sections.push(await Changelog.GenerateSection({ current: releases[versions[i]], previous: releases[versions[i + 1]] }, config));
    }

    return sections.join('\n');
  }

  /**
   * Generates a markdown-formatted changelog and saves it to the specified
   * output file.
   *
   * This method acts as the entry point for the `Generate` method, which will
   * generate the changelog and save it to the specified file.
   * @param config The configuration object containing configuration values for
   * altering how the changelog is generated.
   */
  public static async Save(config: ReadonlyDeep<Config> & { output: string }): Promise<void> {
    if (existsSync(config.output) && !statSync(config.output).isFile()) {
      throw new BumpError(ErrorCodes.INVALID_OUTPUT_PATH);
    } else if (!existsSync(dirname(config.output))) {
      throw new BumpError(ErrorCodes.MISSING_DIRECTORY, dirname(config.output));
    }

    writeFileSync(config.output, await Changelog.GenerateString(config));
  }
}
