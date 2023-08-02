import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { Logger } from '@/structs/Logger';
import { Read } from '@/structs/Read';
import { git } from '@/util/git';
import { Command as BaseCommand, Flags, Interfaces, ux } from '@oclif/core';

import type { Object as ConfigSchema } from '@/schemas/config';
import type { LoggingOptions } from '@/types/LoggingOptions';
import type { Config as CommandConfig } from '@oclif/core';
import type { JsonObject, ReadonlyDeep } from 'type-fest';
import type { ZodError } from 'zod-validation-error';

import * as schemas from '@/schemas';

export type Flags<T extends typeof BaseCommand> = Interfaces.InferredFlags<(typeof Command)['baseFlags'] & T['flags']>;
export type Args<T extends typeof BaseCommand> = Interfaces.InferredArgs<T['args']>;
export type Options<T extends typeof BaseCommand> = Flags<T> & Args<T>;

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
   * The absolute path to the root directory of the user's project.
   *
   * As the command is only available to git repositories, the root directory
   * is the top-level directory of the git repository, where the `.git`
   * directory is located.
   */
  public rootPath!: string;

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
    super.log(Logger.Generate(message, options));
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
    this.log(error.message.trim(), { title: 'error', colors: { title: 'red' } });
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
   * Prompts the user for input.
   *
   * @param question The question to ask the user.
   * @returns The user's input.
   */
  public async prompt(message: string, options?: Partial<LoggingOptions>): Promise<string> {
    return await ux.prompt(Logger.Generate(message, { title: 'bump', ...options }));
  }

  /**
   * Initializes the command and its related properties.
   */
  public async init(): Promise<void> {
    await super.init();

    // This command-line tool is only available to git repositories, as all of
    // the functionalities revolve around git in some way. As such, we'll
    // enforce that the current working directory is within a git repository.
    if (!(await git.checkIsRepo())) {
      throw new BumpError(ErrorCodes.NOT_A_GIT_REPOSITORY);
    }

    // As we're ensured that the command-line tool is being executed within a
    // git repository, we can set the reference to the root directory of the
    // user's project.
    this.rootPath = await git.revparse(['--show-toplevel']);

    // Here, we'll parse the command-line arguments and flags using the commands
    // explicitly set flags and arguments in addition to any base flags.
    const { args, flags } = await this.parse({ flags: this.ctor.flags, baseFlags: super.ctor.baseFlags, args: this.ctor.args });

    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;
  }

  /**
   * Imports the configuration file.
   *
   * By default, the configuration file is assumed to be named `.bumprc.json`
   * within the root directory of the user's project. However, the user can
   * specify an alternative path to the file to import.
   *
   * If the configuration file is invalid, an error will be thrown.
   *
   * @returns The parsed configuration file.
   */
  public importConfig(): ReadonlyDeep<ConfigSchema> {
    const json: JsonObject = Read.JSON(this.flags.config ?? `${this.rootPath}/.bumprc.json`);

    try {
      return schemas.config.Object.parse(json);
    } catch (error) {
      throw new BumpError(ErrorCodes.INVALID_CONFIG, error as ZodError);
    }
  }
}
