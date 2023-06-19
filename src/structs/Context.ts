import { Object as ConfigObject } from '@/schemas/config';
import { Git } from '@/structs/Git';
import { match } from '@/util/match';
import { read } from '@/util/read';
import { run } from '@/util/run';
import { join } from 'path';
import { cwd } from 'process';
import { BumpError, ErrorCodes } from './BumpError';

import * as schemas from '@/schemas';
import * as regex from '@/util/regex';
import * as scripts from '@/util/scripts';

import type { Commit, ConventionalFormat } from '@/types/Commit';
import type { Paths } from '@/types/Paths';
import type { Repo } from '@/types/Repo';
import type { JsonObject, ReadonlyDeep } from 'type-fest';
import type { ZodError } from 'zod';

/**
 * Represents the execution context of the command-line tool.
 *
 * This class provides access to important information regarding the context in
 * which the command-line tool was executed, it includes details such as a
 * reference to the configuration file and relevant paths.
 *
 * A `Context` instance can be initialized to capture these aspects for future
 * reference.
 */
export class Context {
  /**
   * The JSON object imported from the configuration file.
   *
   * This property holds a reference to the JSON object that is imported from
   * the configuration file, which contains various settings and parameters that
   * are used by the command-line tool.
   */
  public readonly config: ReadonlyDeep<ConfigObject>;

  /**
   * An object referencing important paths.
   *
   * This property references important paths within the project where the
   * command-line tool was executed, including information such as the project's
   * root directory.
   */
  public readonly paths: ReadonlyDeep<Paths> = this.generatePaths();

  /**
   * An object holding information about the respective git repository, if the
   * command-line tool was executed within a git repository.
   */
  public readonly repo: ReadonlyDeep<Repo> | null = this.getRepo();

  /**
   * Initializes a new `Context` instance.
   *
   * @param paths Optional paths to reference where to import specific files,
   * such as the configuration file.
   */
  public constructor(paths?: { config?: string }) {
    this.config = this.importConfig(paths?.config ?? this.paths.config);
  }

  /**
   * Imports the configuration object from the specified path.
   *
   * @param path The path to the configuration file.
   * @returns An instance of the configuration object using the values from the
   * specified path.
   */
  private importConfig(path: string): ConfigObject {
    const object: JsonObject = read(path);

    try {
      return ConfigObject.parse(object);
    } catch (error) {
      throw new BumpError(ErrorCodes.INVALID_CONFIG, error as ZodError);
    }
  }

  /**
   * Generates important paths within the project where the command-line tool
   * was executed.
   *
   * If the command-line tool is executed within a git repository, the function
   * will attempt to retrieve the root directory from git, otherwise, the
   * current working directory will be used as the root directory.
   * @returns An object containing important paths within the project.
   */
  private generatePaths(): Paths {
    let root: string;

    try {
      root = run(scripts.git.ROOT);
    } catch {
      root = cwd();
    }

    return { root, config: join(root, '.bumprc.json') };
  }

  /**
   * Generates an object holding information about the respective git
   * repository.
   *
   * @returns Information regarding the git repository.
   */
  private getRepo(): Repo | null {
    if (!Git.IsInstalled()) {
      return null;
    }

    try {
      run(scripts.git.STATUS);
    } catch {
      return null;
    }

    // Represents the URL of the git repository, which represents the remote
    // repository that the local repository is connected to.
    let url: string = run(scripts.git.URL);

    // When grabbing the remote URL, it is possible that the URL is in the form
    // of an SSH URL, which is not supported by the command-line tool. In this
    // case, the URL will be converted to an HTTPS URL.
    if (!schemas.Link.safeParse(url).success) {
      const groups = match(regex.git.SSH_URL, url);

      url = `https://github.com/${groups?.owner}/${groups?.repo}`;
    }

    const commits = Git.History().reduce((acc: Commit[], curr: string) => {
      return [...acc, this.formatCommit(curr)];
    }, []);

    return { url, commits };
  }

  /**
   * Formats a commit into an object.
   *
   * When we retrieve a commit from git, the commit is in the form of a string,
   * which is formatted as follows:
   * ```
   * <hash>|<date>|<tag>|<description>
   * ```
   *
   * This function will format the commit into an object, to make it easier to
   * work with.
   * @param subject The commit's subject.
   * @returns An object representing the commit.
   */
  private formatCommit(subject: string): Commit {
    const [hash, date, tag, description] = subject.split('|');

    // If the commit's subject follows the conventional commit format, then we
    // will format the commit's subject into an object. Thus, we'll deconstruct
    // the various parts of the subject into an object itself.
    const groups = match(regex.CONVENTIONAL_COMMIT, description);

    return {
      hash,
      date,
      tag: match(regex.git.TAG, tag)?.tag ?? undefined,
      subject: groups
        ? ({
            ...groups,
            breaking: groups.breaking !== undefined,
          } as ConventionalFormat)
        : description,
    };
  }
}
