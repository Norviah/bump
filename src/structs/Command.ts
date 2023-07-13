import chalk from 'chalk';

import { Object as Config } from '@/schemas/config';
import { Read } from '@/structs/Read';
import { git } from '@/util/git';
import { Command as BaseCommand, Flags, Interfaces } from '@oclif/core';
import { BumpError, ErrorCodes } from './BumpError';

import type { CommandContext } from '@/types/CommandContex';
import type { LoggingOptions } from '@/types/LoggingOptions';
import type { Config as CommandConfig } from '@oclif/core';
import type { JsonObject, ReadonlyDeep } from 'type-fest';
import type { ZodError } from 'zod-validation-error';

export type Flags<T extends typeof BaseCommand> = Interfaces.InferredFlags<(typeof Command)['baseFlags'] & T['flags']>;
export type Args<T extends typeof BaseCommand> = Interfaces.InferredArgs<T['args']>;

export abstract class Command<T extends typeof BaseCommand> extends BaseCommand {
  /**
   * Parsed flags from the command-line.
   */
  public flags!: Flags<T>;

  /**
   * Parsed arguments from the command-line.
   */
  public args!: Args<T>;

  /**
   * Provides important information regarding the command-line tool.
   *
   * The `context` property is available to all commands, which provides
   * important information regarding the context of the command's execution,
   * such as a reference to the configuration file or paths.
   */
  public context!: ReadonlyDeep<CommandContext>;

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
  public async catch(error: Error): Promise<void> {
    this.log(error.message, { title: 'error', colors: { title: 'red' } });
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
      this.context = await Command.InitializeContext(flags.config);
    } catch (error) {
      this.error((error as Error).message, { exit: 1 });
    }
  }

  /**
   * Imports a configuration object from the specified path.
   *
   * @param path The path to the configuration file.
   * @returns An instance of `Config` using the values from the specified path.
   * @throws A `BumpError` instance with the code `INVALID_CONFIG` if the schema
   * validation fails.
   */
  private static ImportConfig(path: string): Config {
    const object: JsonObject = Read.JSON(path);

    try {
      return Config.parse(object);
    } catch (error) {
      throw new BumpError(ErrorCodes.INVALID_CONFIG, error as ZodError);
    }
  }

  /**
   * Initializes a new `CommandContext` instance.
   *
   * `CommandContext` represents important information regarding the context of
   * where the command-line tool is being executed.
   * @param configPath An optional path to use when importing the configuration
   * object. If not specified, the default configuration path will be used.
   * @returns A new `CommandContext` instance.
   */
  public static async InitializeContext(configPath?: string): Promise<CommandContext> {
    let root: string;

    // If the command was executed within a git repository, we'll set the root
    // directory to reflect the root directory of the git repository. Otherwise,
    // we'll set the root directory to the current working directory.
    if (await git.checkIsRepo()) {
      root = await git.revparse(['--show-toplevel']);
    } else {
      root = process.cwd();
    }

    return { config: Command.ImportConfig(configPath ?? `${root}/.bumprc.json`), rootPath: root };
  }
}
