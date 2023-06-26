import chalk from 'chalk';

import { Command as BaseCommand, Flags, Interfaces } from '@oclif/core';
import { Context } from './Context';

import type { LoggingOptions } from '@/types/LoggingOptions';
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
   * Logs a message to the console.
   *
   * @param message The message to log.
   * @param options The options to use when logging the message.
   */
  public log(message: string, options?: LoggingOptions): void {
    super.log(
      `${options?.title ? `${chalk[options?.colors?.title ?? 'white'](options.title)} ` : ''}${chalk[options?.colors?.message ?? 'white'](message)}`
    );
  }

  /**
   * Executed if an error is thrown during the command's execution.
   *
   * When oclif is executing the command's `run` method, if an error is thrown,
   * the command handler will execute this method with the thrown error. We'll
   * simply log the error and exit the process.
   * @params error The error that was thrown.
   */
  public async catch(error: Error): Promise<never> {
    this.log(error.message, { title: 'error', colors: { title: 'red' } });
    process.exit(1);
  }

  /**
   * A helper method to print a success.
   *
   * @param message The message to log.
   * @param options Options for logging.
   */
  public success(message: string, options?: Partial<LoggingOptions>): void {
    this.log(message, { title: 'ok', ...options, colors: { title: 'green', ...options?.colors } });
  }

  /**
   * A helper method to print a warning.
   *
   * The title is set to `warning` with the color set to `yellow`.
   * @param message The message to log.
   * @param options Options for logging.
   */
  public warning(message: string, options?: Partial<LoggingOptions>): void {
    this.log(message, { title: 'warning', ...options, colors: { title: 'yellow', ...options?.colors } });
  }

  /**
   * A helper method to print information.
   *
   * @param message The message to log.
   * @param options Options for logging.
   */
  public info(message: string, options?: Partial<LoggingOptions>): void {
    this.log(message, { title: 'info', ...options, colors: { title: 'blue', ...options?.colors } });
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
