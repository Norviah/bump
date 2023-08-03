import { Command } from '@/structs/Command';
import { existsSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

import type { Object as ConfigSchema } from '@/schemas/config';
import type { Explicit } from '@/types/ts/Explicit';

const CONFIG_TEMPLATE: Explicit<ConfigSchema> = {
  tasks: {
    pre: [
      {
        name: 'ensure source code is formatted',
        command: './node_modules/prettier/bin/prettier.cjs --config .prettierrc.json --list-different ./src',
        timeout: 15000,
      },
      {
        name: 'ensure source code can be built',
        command: 'pnpm run build',
        timeout: 15000,
      },
    ],
    post: [],
  },
  provider: {
    type: 'json',
    path: 'package.json',
    key: 'version',
  },
  types: [
    {
      type: 'feat',
      name: 'Features',
      hidden: false,
    },
    {
      type: 'fix',
      name: 'Bug Fixes',
      hidden: false,
    },
    {
      type: 'revert',
      name: 'Reverted',
      hidden: false,
    },
    {
      type: 'refactor',
      name: 'Refactor',
      hidden: false,
    },
    {
      type: 'build',
      name: 'Build System',
      hidden: false,
    },
    {
      type: 'init',
      name: 'Init',
      hidden: false,
    },
    {
      type: 'remove',
      name: 'Removed Features',
      hidden: false,
    },
    {
      type: 'chore',
      hidden: true,
    },
    {
      type: 'docs',
      hidden: true,
    },
  ],
  prompt: false,
  unreleasedHeader: 'Unreleased',
  breakingHeader: '⚠ Breaking Changes',
  includeBody: false,
  includeNonConventionalCommits: true,
  tag: 'v{{after}}',
  releaseSubject: 'chore(release): {{tag}}',
  changelogSubject: 'docs(changelog): {{tag}}',
};

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

    writeFileSync(output, JSON.stringify(CONFIG_TEMPLATE, null, 2));

    this.info(`saved configuration file to ${output}`);
  }
}
