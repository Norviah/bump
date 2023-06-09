import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { Changelog } from '@/structs/Changelog';
import { Command } from '@/structs/Command';
import { git } from '@/util/git';
import { Flags } from '@oclif/core';

import { existsSync, statSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';

/**
 * The `changelog generate` subcommand.
 *
 * This subcommand is responsible for generating a changelog based off of the
 * commits in the git repository where the command was executed, thus, this
 * command can only be executed within a git repository.
 *
 * This subcommand will read every commit within the repository and generate a
 * changelog based on these commits.
 * @example
 * ```sh
 * $ bump changelog generate
 * ```
 * ```sh
 * $ bump changelog generate --output ./CHANGELOG.md
 * ```
 */
export default class Generate extends Command<typeof Generate> {
  /**
   * The command's summary.
   *
   * A small, brief description regarding the command and its purpose. This
   * summary is displayed when the user asks for help regarding the command.
   */
  public static summary: string = 'Generates a changelog based on the commits within the repository.';

  /**
   * The command's description.
   *
   * A more detailed description regarding the command and its purpose. This
   * property should describe the command in more detail than the `summary`
   */
  public static description: string = '';

  /**
   * Available options for the command.
   *
   * The user may provide these options to the command to alter the command's
   * behavior.
   */
  public static flags = {
    output: Flags.string({ char: 'o', description: 'The desired output for the changelog.', required: false }),
  };

  /**
   * Initializes the command and relevant properties.
   *
   * As this command requires to be executed within a git repository, we'll
   * override the `init` method to ensure this by checking if the `Context`
   * object has a reference to a git repository.
   */
  public async init(): Promise<void> {
    await super.init();

    if (!(await git.checkIsRepo())) {
      throw new BumpError(ErrorCodes.NOT_A_GIT_REPOSITORY);
    }
  }

  /**
   * The command's execution logic.
   *
   * When executed, the command generates a changelog based on the commits
   * within the repository and saves it to the provided output path. If no
   * output path is specified, the changelog is saved to the project's root
   * directory.
   *
   * @remarks
   * The generated changelog is written in Markdown format. If the specified
   * output path already exists and is not a file, an error is thrown. Upon
   * successful generation and saving of the changelog, a success message is
   * displayed with the path to the saved changelog file.
   *
   * @example
   * Generates a changelog and saves it to the default output path.
   * ```sh
   * $ bump changelog generate
   * ```
   *
   * Generates a changelog and saves it to the specified output path.
   * ```sh
   * $ bump changelog generate --output ./CHANGELOG.md
   * ```
   */
  public async run(): Promise<void> {
    // Represents the path to save the changelog to, if a path is not provided,
    // the changelog is instead saved to the project's root directory.
    const output: string = resolve(this.flags.output ?? join(this.context.rootPath, 'CHANGELOG.md'));

    // If the user has provided a path through the `output` option, we'll ensure
    // that if the path exists, it is a file.
    if (this.flags.output && existsSync(output) && !statSync(output).isFile()) {
      throw new BumpError(ErrorCodes.INVALID_OUTPUT_PATH);
    } else if (!existsSync(dirname(output))) {
      throw new BumpError(ErrorCodes.MISSING_DIRECTORY, dirname(output));
    }

    try {
      writeFileSync(output, await Changelog.Generate(this.context.config));
    } catch (e) {
      this.error((e as Error).message);
    }

    this.success(`successfully generated changelog to \`${output}\`.`);
  }
}
