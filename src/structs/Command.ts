import { Command as BaseCommand, Flags, Interfaces } from '@oclif/core';
import { Context } from './Context';

import type { Config as CommandConfig } from '@oclif/core';

export type Flags<T extends typeof BaseCommand> = Interfaces.InferredFlags<(typeof Command)['baseFlags'] & T['flags']>;
export type Args<T extends typeof BaseCommand> = Interfaces.InferredArgs<T['args']>;

export abstract class Command<T extends typeof BaseCommand> extends BaseCommand {
  /**
   * Parsed flags from the command-line.
   */
  protected flags!: Flags<T>;

  /**
   * Parsed arguments from the command-line.
   */
  protected args!: Args<T>;

  /**
   * Provides important information regarding the command-line tool.
   *
   * `context` references a `Context` instance, which is used to provide
   * important information regarding the command-line tool.
   */
  protected context!: Context;

  /**
   * The base flags for commands.
   *
   * `baseFlags` is used to implement a common set of flags for all commands,
   * regardless of the command.
   */
  public static baseFlags = {
    config: Flags.file({ char: 'c', required: false, description: 'an alternative configuration file to use' }),
  };

  /**
   * Initializes a new `Command` instance.
   *
   * @param argv The arguments passed to the command.
   * @param config The configuration of the command.
   */
  public constructor(argv: string[], config: CommandConfig) {
    super(argv, config);
  }

  /**
   * Initializes the command and its related properties.
   */
  public async init(): Promise<void> {
    await super.init();

    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof Command).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });

    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;

    try {
      this.context = new Context({ config: this.flags.config });
    } catch (error) {
      this.error((error as Error).message, { exit: 1 });
    }
  }
}
