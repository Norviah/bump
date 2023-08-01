import chalk from 'chalk';

import { Changelog } from '@/structs/Changelog';
import { Logger } from '@/structs/Logger';
import { bump } from '@/util/bump';
import { git } from '@/util/git';
import { icons } from '@/util/icons';
import { replace } from '@/util/replace';
import { run } from '@/util/run';
import { ux } from '@oclif/core';
import { isAbsolute, resolve } from 'path';

import type ReleaseCommand from '@/commands/release';

import type { Release as ReleaseSchema, SemVer as SemVerSchema } from '@/schemas';
import type { Provider as ProviderSchema, Task as TaskSchema } from '@/schemas/config';
import type { BumpError, ErrorCodes } from '@/structs/BumpError';
import type { Options } from '@/structs/Command';
import type { CommandContext } from '@/types/CommandContex';
import type { ReadonlyDeep } from 'type-fest';

type Substitutions = { tag: string; subject: string; changelog: string };

/**
 * Defines the structure of a provider.
 *
 * In the context for this command-line tool, a provider is a method that is
 * used to work with the user's project. It is responsible for reading and
 * writing the project's version, as well as performing any other tasks that
 * are required to bump the project's version.
 *
 * @template T The type of the provider.
 */
export abstract class BaseProvider<T extends ProviderSchema['type']> {
  /**
   * The absolute path to the project's root directory.
   */
  public rootPath!: ReadonlyDeep<CommandContext<T>['rootPath']>;

  /**
   * The command-line tool's configuration object.
   *
   * This property references the command-line tool's configuration file,
   * which will alter the behavior of the command-line tool.
   */
  public config!: ReadonlyDeep<CommandContext<T>['config']>;

  /**
   * Initializes a new `BaseProvider` instance.
   *
   * @param context The execution context of the command-line tool.
   */
  public constructor(context: ReadonlyDeep<CommandContext<T>>) {
    Object.assign(this, context);
  }

  /**
   * Gets the current version of the project.
   *
   * This method imports the project's version from whatever medium the
   * provider handles.
   *
   * @returns The current version of the project.
   */
  public abstract version(): SemVerSchema;

  /**
   * Saves the specified version to the provider's respective medium.
   *
   * This method is called after the project's version has been bumped, it is
   * responsible for implementing the logic for writing the new version into
   * whatver medium the provider handles.
   *
   * @param version The bumped version of the project.
   */
  public abstract save(version: SemVerSchema): void;

  /**
   * Gets the absolute path of the provided path.
   *
   * This method is used to get the absolute path of a file, in respect to the
   * project's root directory. If the provided path is already an absolute
   * path, it will be returned as-is.
   *
   * @param path The path to get the absolute path of.
   * @returns The absolute path of the specified path.
   * @example
   * ```ts
   * provider.absolute('config.json'); // => /home/user/project/config.json
   * provider.absolute('/home/user/config.json'); // => /home/user/config.json
   * ```
   */
  public absolute(path: string): string {
    return isAbsolute(path) ? path : resolve(this.rootPath, path);
  }

  /**
   * Gets the absolute path to the file that contains the project's version.
   *
   * Whatever medium the provider represents, a provider will always have a file
   * that contains the project's version, which is specified by the user within
   * the `provider.path` property of the configuration file.
   *
   * This method will return the absolute path of that file, in respect to the
   * project's root directory.
   *
   * @returns The absolute path to the project's version file.
   */
  public get file(): string {
    return this.absolute(this.config.provider.path);
  }

  /**
   * Updates the project's version in respect to the specified release type.
   *
   * @param type The type of release to perform.
   * @returns A reference to the project's version before and after the bump
   * process.
   */
  public update(type: ReleaseSchema): { before: SemVerSchema; after: SemVerSchema } {
    // Before bumping the project's version, we'll first want to save a
    // reference to the project's version before the bump process.
    const before: SemVerSchema = this.version();

    const after: SemVerSchema = bump(before, type);

    // Once the project's version has been bumped, we'll want to save the
    // version to disk, to whatever medium the provider is responsible
    // for.

    // The logic for this is implemented within the `save` method, which
    // is abstracted to the provider, as each provider will have a unique
    // medium to save the project's version to.
    this.save(after);

    return { before, after };
  }

  /**
   * Executes the tasks defined within the configuration file.
   *
   * The bump process is split into three phases:
   *
   * 1. Pre bump,
   * 2. Bumping the version,
   * 3. Post bump.
   *
   * As defined by the configuration file, the user can define scripts to be
   * executed during the first and last phases of the bump process. This method
   * will execute the tasks defined within the configuration file for the
   * specified phase.
   *
   * @param phase The specific phase of the process to execute the tasks for.
   */
  private async executeTasks(phase: 'pre' | 'post', options: Options<typeof ReleaseCommand>): Promise<void> {
    const tasks: readonly ReadonlyDeep<TaskSchema>[] = this.config.tasks[phase];

    for (let i = 0; i < tasks.length; i++) {
      const task: ReadonlyDeep<TaskSchema> = tasks[i];

      // Oclif fortunately provides useful components for working with the
      // command-line tool, in this case, we can use the action component to
      // present the user with a loading indicator.
      ux.action.start(Logger.Generate(`executing task: ${task.name}`, { title: phase }));

      try {
        // We'll then execute the command, forcing it to run within the root
        // directory of the project. If the command returns a non-zero exit
        // code, an error is thrown and the bump process is halted.
        const result: string = await run(task.command, { root: this.rootPath, timeout: task.timeout });

        ux.action.stop(icons.CHECKMARK);

        // If the script has an output, and the user has specified the `verbose`
        // flag, we'll print the output to the console.
        if (options.verbose && result.length > 0) {
          console.log(`\n${result.trim()}${i === tasks.length - 1 ? '' : '\n'}`);
        }
      } catch (error) {
        // If an error occurs, we'll stop the loading indicator and print the
        // error to the console.
        ux.action.stop(icons.X);

        console.log(`\n${(error as BumpError<ErrorCodes.SCRIPT_ERROR>).message.trim()}\n`);

        // We'll then throw an error, halting the bump process.
        throw new Error(`task \`${task.name}\` failed`);
      }
    }
  }

  /**
   * Substitutes various placeholders within strings used by the bump process.
   *
   * When bumping the project's version, naturally, a commit and tag will be
   * created for the new release. The subjects and tags for these commits are
   * determined by the user within the configuration file.
   *
   * In addition to the user-defined strings, the user can also use placeholders
   * to reference aspects of the release, specifically: the previous version,
   * the new version, and, where applicable, the tag of the release. This method
   * will substitute these placeholders with their respective values.
   *
   * @param options The arguments and flags passed to the `relase` command.
   * @returns An object referencing the strings to use for the subjects with the
   * placeholders substituted.
   */
  public substitute(options: Options<typeof ReleaseCommand> & { before: SemVerSchema; after: SemVerSchema }): Substitutions {
    // The strings are defined by the user within the configuration file,
    // however, we provider placeholders for the user to use, to reference
    // aspects of the new release.
    //
    // The placeholders supported are:
    //   - `{{after}}`: represents the new version of the project,
    //   - `{{before}}`: represents the previous version of the project,
    //   - `{{tag}}`: represents the actual tag of the release.

    const tag: string = replace(this.config.tag, { '{{after}}': options.after, '{{before}}': options.before });
    const subject: string = replace(this.config.releaseSubject, { '{{after}}': options.after, '{{before}}': options.before, '{{tag}}': tag });
    const changelog: string = replace(this.config.changelogSubject, { '{{after}}': options.after, '{{before}}': options.before, '{{tag}}': tag });

    return { tag, subject, changelog };
  }

  /**
   * Adds and commits the changes to the project's version file.
   *
   * This method is responsible for adding and committing the changes to the
   * project's version file, in addition to creating a new tag for the release,
   * note that the commit is not pushed -- this is left to the user.
   *
   * The user can alter aspects of the commit and tag, such as the subject for
   * the commit and the name of the tag as well, in addition to other aspects
   * which are defined within the configuration file.
   *
   * @param options A reference to the arguments and flags for the `release`
   * command.
   */
  public async commit(options: Options<typeof ReleaseCommand> & { substitutions: Substitutions }): Promise<void> {
    const { tag, subject } = options.substitutions;

    // After the project's version has been bumped, we'll want to commit the
    // changes to the project's version file. Using `simple-git`, we can
    // easily add and commit the changes.

    await git.add(this.file);

    // When generating the commit's message, we'll want to format the message
    // in a format like:
    //
    // ```
    // subject
    //
    // body
    // ```

    // If the user has not specified a body, we'll simply trim the message. The
    // reason for this is that there are issues when specifying the body using a
    // `-m` flag through `simple-git`.

    await git.commit(options.body ? `${subject}\n\n${options.body}` : subject);

    // Finally, we'll add an annotated tag to the commit, which will be used to
    // reference the release. Similar to the commit message, we'll format the
    // tag to reference the provided body.

    await git.addAnnotatedTag(tag, options.body ? `${tag}\n\n${options.body}` : tag);
  }

  /**
   * Generates the changelog for the release.
   *
   * This method will generate the changelog for the release, then adding it and
   * committing it to git.
   *
   * TODO: Properly commit the changelog into the release's respective commit,
   * instead of committing it separately. As of now, the changelog is committed
   * after the release, making it under the next release.
   *
   * @param options A reference to the arguments and flags for the `release`
   * command.
   */
  public async generateChangelog(options: Options<typeof ReleaseCommand> & { substitutions: Substitutions }): Promise<void> {
    ux.action.start(Logger.Generate('generating changelog', { title: 'bump' }));

    // First, we'll need to determine where to save the changelog. Through the
    // `release` command, the user may enter the `--output` flag to specify the
    // path to save the changelog to.

    // If the user does not specify this flag, the changelog is saved under the
    // the project's root directory, under the name `CHANGELOG.md`.
    const output: string = this.absolute(options.output || 'CHANGELOG.md');

    try {
      await Changelog.Save({ ...this.config, output });
    } catch (error) {
      ux.action.stop(`${icons.X}\n`);

      throw error;
    }

    ux.action.stop(icons.CHECKMARK);

    // After the changelog has been generated, we'll add and commit the file to
    // git.

    // TODO: Properly commit the file under the release's respective commit, as
    // the following lines simply adds a new commit to the repository, as the
    // commit is directly after the release, the changelog is under the next
    // release.

    await git.add(this.absolute(output));
    await git.commit(options.substitutions.changelog);
  }

  /**
   * Bumps the project's version.
   *
   * `bump` will implement the full process of bumping the project's version,
   * which means that it will perform the following steps:
   *
   * 1. Perform each pre-bump script within the configuration file,
   * 2. Update the project's version,
   * 3. Perform each post-bump script within the configuration file.
   *
   * If an error occurs during any point of the process, the bump process will
   * be halted and the error will be thrown.
   *
   * @param options Represents all flags and arguments passed to the `release`
   * command, which will alter the behavior of the bump process.
   */
  public async bump(options: Options<typeof ReleaseCommand>): Promise<void> {
    if (this.config.tasks.pre.length > 0) {
      // First, we'll execute all pre-bump scripts as defined within the config
      // file, if any script returns a non-zero exit code, an error is thrown
      // and the bump process is halted.
      await this.executeTasks('pre', options);

      console.log();
    }

    // After the pre-bump scripts have been executed, and no errors have been
    // thrown, we'll update the project's version.

    // When the project's version has been bumped, we'll have a reference to the
    // project's version before and after the bump process. We'll use these
    // references to generate aspects of the commit.
    const { before, after } = this.update(options.type);

    Logger.Print(`bumped version from ${chalk.bold(before)} to ${chalk.bold(after)}`, { title: 'bump' });

    // Before continuring, we'll want to get a reference to the strings used for
    // the tag and various commit subjects. These strings are given by the user,
    // but they may also contain placeholders, which will be substituted for.
    const substitutions: Substitutions = this.substitute({ ...options, before, after });

    try {
      ux.action.start(Logger.Generate('committing changes', { title: 'bump' }));

      // After the project's version has been bumped, we'll want to commit the
      // changes to the project's version file. For the new release, we'll add
      // the version file and create a tagged commit for the release.
      await this.commit({ ...options, substitutions });

      ux.action.stop(icons.CHECKMARK);
    } catch (error) {
      ux.action.stop(`${icons.X}\n`);

      throw error;
    }

    // After the project's version has been bumped and a new commit has been
    // created for the release, if the user opts to, we'll then generate the
    // changelog for the release.
    if (options.changelog) {
      await this.generateChangelog({ ...options, substitutions });
    }

    if (this.config.tasks.post.length > 0) {
      console.log();

      // Finally, if the user has defined any post-bump scripts, we'll execute
      // them now.
      await this.executeTasks('post', options);
    }
  }
}
