import { Changelog } from '@/structs/Changelog';
import { Command } from '@/structs/Command';
import { Logger } from '@/structs/Logger';
import { icons } from '@/util/icons';
import { Flags, ux } from '@oclif/core';

import { join, resolve } from 'path';

import type { Object as ConfigSchema } from '@/schemas/config';
import type { ReadonlyDeep } from 'type-fest';

/**
 * The `changelog generate` subcommand.
 *
 * This subcommand is responsible for generating a changelog based off of the
 * commits in the git repository where the command was executed. Every commit
 * within the repository is read and parsed, and a changelog is generated based
 * on these commits.
 *
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
   * property.
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
    const config: ReadonlyDeep<ConfigSchema> = this.importConfig();

    // Represents the path to save the changelog to, if a path is not provided,
    // the changelog is instead saved to the project's root directory.
    const output: string = resolve(this.flags.output ?? join(this.rootPath, 'CHANGELOG.md'));

    ux.action.start(Logger.Generate('generating changelog', { title: 'bump' }));

    try {
      await Changelog.Save({ ...config, output });
    } catch (error) {
      // If an error occurs during the generation of the changelog, we'll want
      // to first stop the spinner, then throw the error - which will be caught
      // by the command's error handler.
      ux.action.stop(icons.X);

      throw error;
    }

    ux.action.stop(icons.CHECKMARK);
  }
}
