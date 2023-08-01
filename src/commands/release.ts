import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { Command } from '@/structs/Command';
import { JsonProvider, TextFileProvider } from '@/structs/providers';
import { bump } from '@/util/bump';
import { git } from '@/util/git';
import { Args, Flags } from '@oclif/core';

import * as schemas from '@/schemas';

import type { Provider as ProviderSchema } from '@/schemas/config';
import type { BaseProvider } from '@/structs/providers';
import type { CommandContext } from '@/types/CommandContext';
import type { Arg } from '@oclif/core/lib/interfaces/parser';
import type { ReadonlyDeep } from 'type-fest';

/**
 * The `release` command.
 *
 * This command is responsible for releasing a new version of the user's
 * project, performing the pre-bump and post-bump scripts defined within the
 * configuration file.
 *
 * @example
 * ```sh
 * $ bump release (major|minor|patch)
 * ```
 */
export default class Release extends Command<typeof Release> {
  /**
   * The command's summary.
   *
   * A small, brief description regarding the command.
   */
  public static summary = 'Release a new version of your project.';

  /**
   * The command's description.
   *
   * A more detailed description regarding the command, this should thoroughly
   * describe the command and its purpose.
   */
  public static description = `This command is used to release a new version of 
    your project, performing the scripts defined within the configuration file.
    When this command is executed, it will follow these steps:

    ⠀  1. Execute all pre-bump scripts,
    ⠀  2. Bump the version of the project,
    ⠀  3. Execute all post-bump scripts.
  
    Once the process is finished, run \`git push --follow-tags\` to push the
    changes to the repository.
  
    At any point during this process, if an error is occured, the error is presented
    and the process is halted.`;

  /**
   * Examples for the command.
   */
  public static examples = [
    '<%= config.bin %> <%= command.id %> major',
    '<%= config.bin %> <%= command.id %> major --changelog --output ./CHANGELOG.md',
  ];

  /**
   * Positional arguments for the command.
   *
   * These arguments are required for the command to do its intended purpose.
   */
  public static args = {
    /**
     * The `type` argument.
     *
     * Represents the type of release to perform, determining which part of the
     * version to bump.
     */
    type: Args.string({
      required: true,
      description: 'The type of release to perform.',
      options: Object.values(schemas.Release.options),
    }) as Arg<schemas.Release, Record<string, unknown>>,
  };

  /**
   * Available options for the command.
   *
   * The user may provide these options to the command to alter the command's
   * behavior.
   */
  public static flags = {
    /**
     * The `--clean` flag.
     *
     * Determines if the command should ensure the repository is clean before
     * bumping the project.
     */
    clean: Flags.boolean({ description: 'Ensure the repository is clean before bumping the version.', default: false }),

    /**
     * The `--body` flag.
     *
     * The body to use for the commit for the release, the user may specify a
     * custom body to provide additional information regarding the release,
     * information such as the goal or purpose of the release.
     */
    body: Flags.string({ char: 'b', summary: "The body to use for the release's commit.", required: false }),

    /**
     * The `--verbose` flag.
     *
     * Determines if the command should print the output of tasks after
     * execution, if applicable.
     */
    verbose: Flags.boolean({ char: 'v', description: 'Whether to print the output of tasks after execution.', default: false }),

    /**
     * The `--changelog` flag.
     *
     * Determines if the command should also generate a changelog for the
     * release.
     */
    changelog: Flags.boolean({ description: 'Whether to additionally generate the changelog for the release.' }),

    /**
     * The `--output` flag.
     *
     * Determines the desired output for the changelog, thus, this flag is only
     * applicable if the `--changelog` flag is provided.
     */
    output: Flags.string({ char: 'o', description: 'The desired output file for the changelog.', required: false, dependsOn: ['changelog'] }),

    /**
     * The `--yes` flag.
     *
     * In the configuration file, the user may opt to require the user to
     * confirm before bumping the project. If this feature is enabled, the user
     * may provide this flag to bypass the confirmation prompt.
     */
    force: Flags.boolean({ char: 'f', description: 'Forces the command to execute without prompting for confirmation.', default: false }),
  };

  /**
   * The command's execution logic.
   *
   * When executed, the command will bump the project and perform all pre-bump
   * and post-bump scripts defined within the configuration file.
   */
  public async run(): Promise<void> {
    // Initially, we'll determine if the user has provided the `--ensure` flag,
    // if so, we'll ensure the repository does not have any uncommitted changes
    // before continuing.
    if (this.flags.clean && !(await git.status()).isClean()) {
      throw new BumpError(ErrorCodes.DIRTY_REPO);
    }

    // We'll need to determine the provider to use when bumping the project,
    // providers are methods used to bump the project, such as a JSON file or a
    // text file.

    // Using the configuration file, we'll determine the provider to use.
    let provider: BaseProvider<ProviderSchema['type']>;

    if (this.context.config.provider.type === 'json') {
      provider = new JsonProvider(this.context as ReadonlyDeep<CommandContext<'json'>>);
    } else {
      provider = new TextFileProvider(this.context as ReadonlyDeep<CommandContext<'text'>>);
    }

    // If the user has opted to be prompted before bumping the project, we'll
    // comply with their request and prompt them before continuing. However, if
    // the user has provided the `--force` flag, we'll bypass the prompt.
    if (this.context.config.prompt && !this.flags.force) {
      // When prompting the user, we'll want to inform them of the current
      // version of the project as well as the version the project will be
      // bumped to.

      // We want them to know what the bumping process will do.
      const version: schemas.SemVer = provider.version();

      const response = await this.prompt(`are you sure you want to bump the project from ${version} to ${bump(version, this.args.type)}? [y/n]`);

      if (!['y', 'yes'].includes(response.toLowerCase())) {
        return this.info('command cancelled.', { title: '\ninfo' });
      }

      console.log();
    }

    // Once we've determined the provider to use and, if applicable, prompted
    // the user, we'll start the bump process.

    // The logic for the process is handled within the provider, in a nutshell,
    // the provider will perform the following steps:
    //
    //   1. Execute all pre-bump scripts,
    //   2. Bump the version (and generate the changelog, if applicable),
    //   3. Execute all post-bump scripts.
    //
    // If an error occurs during any of these steps, the process is halted and
    // the error is presented to the user.
    await provider.bump({ ...this.flags, ...this.args });
  }
}
