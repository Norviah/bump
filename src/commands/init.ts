import { Command } from '@/structs/Command';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

/**
 * The `init` command.
 *
 * This command simply creates a configuration file for the user to edit.
 *
 * @example
 * ```sh
 * $ bump init
 * ```
 */
export default class Init extends Command<typeof Init> {
  /**
   * The command's summary.
   *
   * A small, brief description regarding the command and its purpose. This
   * summary is displayed when the user asks for help regarding the command.
   */
  public static summary: string = 'Creates a configuration file for the project.';

  /**
   * The command's description.
   *
   * A more detailed description regarding the command and its purpose. This
   * property should describe the command in more detail than the `summary`
   * property.
   */
  public static description: string = 'If you are initializing a new project, this command will create a configuration file for you to edit.';

  /**
   * Examples for the command.
   */
  public static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --config ./.config.json'];

  /**
   * The command's execution logic.
   */
  public async run(): Promise<void> {
    const output: string = resolve(this.flags.config || join(this.rootPath, '.bumprc.json'));

    // Before writing the configuration file, we'll first want to check if there
    // already exists a file as we don't want to overwrite it.
    if (existsSync(output)) {
      const response = await this.prompt(`there is already a configuration file at ${output}, would you like to overwrite it? [y/n]`);

      if (!['y', 'yes'].includes(response.toLowerCase())) {
        return this.info('command cancelled');
      }
    }

    writeFileSync(output, readFileSync(join(this.config.root, '.bumprc.json.scheme')));

    this.info(`saved configuration file to ${output}`);
  }
}
