import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { Command } from '@/structs/Command';
import { JsonProvider, TextFileProvider } from '@/structs/providers';
import { Args, Flags } from '@oclif/core';

import type { Object as ConfigSchema, InferProvider, Provider as ProviderSchema } from '@/schemas/config';
import type { BaseProvider } from '@/structs/providers';
import type { Arg } from '@oclif/core/lib/interfaces/parser';
import type { ReadonlyDeep } from 'type-fest';

/**
 * The `phase` command.
 *
 * This command is responsible for allowing the user to execute a specific
 * phase, either the pre-bump or post-bump phase, without actually bumping the
 * version of the project.
 *
 * @example
 * ```sh
 * $ bump phase pre
 * ```
 */
export default class Phase extends Command<typeof Phase> {
  /**
   * The command's summary.
   *
   * A small, brief description regarding the command.
   */
  public static summary = 'Test a specific phase of the bump process, without actually bumping the version.';

  /**
   * The command's description.
   *
   * A more detailed description regarding the command, this should thoroughly
   * describe the command and its purpose.
   */
  public static description = `When performing the bump process with the \`release\` 
    command, the process is split into three phases: pre-bump, bump, and post-bump.
    Within the pre-bump and post-bump phases, the tool executes the scripts specified
    in the configuration file, whereas the bump phase is an internal process that
    bumps the version of the project and commits the changes to the repository.
    
    This command allows you to test a specific phase of the bump process, either the
    pre-bump or post-bump phase without actually bumping the version of your project.`;

  /**
   * Examples for the command.
   */
  public static examples = ['<%= config.bin %> <%= command.id %> pre', '<%= config.bin %> <%= command.id %> post'];

  /**
   * Positional arguments for the command.
   *
   * These arguments are required for the command to do its intended purpose.
   */
  public static args = {
    /**
     * The `phase` argument.
     *
     * This argument is used to specify which phase of the bump process to test.
     */
    phase: Args.string({ required: true, description: 'The phase to test.', options: ['pre', 'post'] }) as Arg<
      'pre' | 'post',
      Record<string, unknown>
    >,
  };

  /**
   * Available options for the command.
   *
   * The user may provide these options to the command to alter the command's
   * behavior.
   */
  public static flags = {
    /**
     * The `--verbose` flag.
     *
     * Determines if the command should print the output of tasks after
     * execution, if applicable.
     */
    verbose: Flags.boolean({ char: 'v', description: 'Whether to print the output of tasks after execution.', default: false }),
  };

  /**
   * The command's execution logic.
   *
   * When executed, the command will run all tasks within the specified phase.
   */
  public async run(): Promise<void> {
    const config: ReadonlyDeep<ConfigSchema> = this.importConfig();

    // Using the configuration file, we'll determine the provider to use.
    let provider: BaseProvider<ProviderSchema['type']>;

    if (config.provider.type === 'json') {
      provider = new JsonProvider({ config: config as InferProvider<'json'>, rootPath: this.rootPath });
    } else {
      provider = new TextFileProvider({ config: config as InferProvider<'text'>, rootPath: this.rootPath });
    }

    // Before executing the tasks, we'll ensure that the user has defined tasks
    // to run within the specified phase.
    if (config.tasks[this.args.phase].length === 0) {
      throw new BumpError(ErrorCodes.NO_SPECIFIED_TASKS, this.args.phase);
    }

    provider.executeTasks(this.args.phase, this.flags);
  }
}
