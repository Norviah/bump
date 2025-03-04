import { fromZodError } from 'zod-validation-error';

import type { ZodError } from 'zod';
import type { ExecaError } from 'execa';

export enum ErrorCodes {
  /**
   * The event where a text file was not found.
   */
  MISSING_TEXT_FILE = 'MISSING_TEXT_FILE',

  /**
   * The event where a non-text file was provided.
   */
  NON_TEXT_FILE = 'NON_TEXT_FILE',

  /**
   * The event where a JSON file was not found.
   */
  MISSING_JSON_FILE = 'MISSING_JSON_FILE',

  /**
   * The event where a non-JSON file was provided.
   */
  NON_JSON_FILE = 'NON_JSON_FILE',

  /**
   * The event where an invalid JSON file was provided.
   */
  INVALID_JSON = 'INVALID_JSON',

  /**
   * The event where a shell script failed to execute.
   */
  SCRIPT_ERROR = 'SCRIPT_ERROR',

  /**
   * The event where the configuration file is invalid.
   */
  INVALID_CONFIG = 'INVALID_CONFIG',

  /**
   * The event where the git command is not installed.
   */
  GIT_NOT_INSTALLED = 'GIT_NOT_INSTALLED',

  /**
   * The event where the command-line tool is called from outside of a git
   * repository.
   */
  NOT_A_GIT_REPOSITORY = 'NOT_A_GIT_REPOSITORY',

  /**
   * The event where the user attempts to save an output file to a directory.
   */
  INVALID_OUTPUT_PATH = 'INVALID_OUTPUT_PATH',

  /**
   * The event where the directory to save the output file to does not exist.
   */
  MISSING_DIRECTORY = 'MISSING_DIRECTORY',

  /**
   * The event where the user passes an invalid argument from a predefined set
   * of options.
   */
  INVALID_ARG_OPTION = 'INVALID_ARG_OPTION',

  /**
   * The event where the user is working with a dirty git repository, when they
   * want to work with a clean one.
   */
  DIRTY_REPO = 'DIRTY_REPO',

  /**
   * The event where the user runs the `phsae` command, but did not specify any
   * tasks to run for the specified phase.
   */
  NO_SPECIFIED_TASKS = 'NO_SPECIFIED_TASKS',
}

const Messages = {
  /**
   * Generates the error message for the `MISSING_TEXT_FILE` error code.
   *
   * @param path The path to the text file.
   * @returns The generated error message.
   */
  MISSING_TEXT_FILE: (path: string): string => {
    return `the text file at \`${path}\` does not exist.`;
  },

  /**
   * Generates the error message for the `NON_TEXT_FILE` error code.
   *
   * @param path The path to the text file.
   * @returns The generated error message.
   */
  NON_TEXT_FILE: (path: string): string => {
    return `the path \`${path}\` is not a text file.`;
  },

  /**
   * Generates the error message for the `MISSING_JSON_FILE` error code.
   *
   * @param path The path to the JSON file.
   * @returns The generated error message.
   */
  MISSING_JSON_FILE: (path: string): string => {
    return `the JSON file at \`${path}\` does not exist.`;
  },

  /**
   * Generates the error message for the `NON_JSON_FILE` error code.
   *
   * @param path The path to the JSON file.
   * @returns The generated error message.
   */
  NON_JSON_FILE: (path: string): string => {
    return `the path \`${path}\` is not a JSON file.`;
  },

  /**
   * Generates the error message for the `INVALID_JSON` error code.
   *
   * @param path The path to the JSON file.
   * @returns The generated error message.
   */
  INVALID_JSON: (path: string): string => {
    return `the JSON file at \`${path}\` is invalid.`;
  },

  /**
   * Generates the error message for the `SCRIPT_ERROR` error code.
   *
   * @param info Information regarding the thrown spawn error.
   * @returns The generated error message.
   */
  SCRIPT_ERROR: (error: ExecaError): string => {
    if (error?.stderr.length > 0 || error?.stdout.length > 0) {
      return `${error.stdout.trim()}\n\n${error.stderr.trim()}`.trim();
    }

    return error.message || 'an unknown error occurred.';
  },

  /**
   * Generates the error message for the `INVALID_CONFIG` error code.
   *
   * @param error The error thrown by Zod.
   * @returns The generated error message.
   */
  INVALID_CONFIG: (error: ZodError): string => {
    return `the configuration file is invalid: ${fromZodError(error).message.split(': ')[1]}`;
  },

  /**
   * Generates the error message for the `GIT_NOT_INSTALLED` error code.
   *
   * @returns The generated error message.
   */
  GIT_NOT_INSTALLED: (): string => {
    return 'git is not installed.';
  },

  /**
   * Generates the error message for the `NOT_A_GIT_REPOSITORY` error code.
   *
   * @returns The generated error message.
   */
  NOT_A_GIT_REPOSITORY: (): string => {
    return 'this command must be run from inside a git repository.';
  },

  /**
   * Generates the error message for the `INVALID_OUTPUT_FILE` error code.
   *
   * @returns The generated error message.
   */
  INVALID_OUTPUT_PATH: (): string => {
    return 'the output file cannot be saved to a directory.';
  },

  /**
   * Generates the error message for the `MISSING_DIRECTORY` error code.
   *
   * @param path The path to the directory.
   * @returns The generated error message.
   */
  MISSING_DIRECTORY: (path: string): string => {
    return `the directory at \`${path}\` does not exist.`;
  },

  /**
   * Generates the error message for the `INVALID_ARG_OPTION` error code.
   *
   * @param option The invalid option.
   * @param options The valid options.
   * @returns The generated error message.
   */
  INVALID_ARG_OPTION: (option: string, options: string[]): string => {
    return `the argument \`${option}\` is invalid, expected one of: ${options.map((option) => `\`${option}\``).join(', ')}.`;
  },

  /**
   * Generates the error message for the `DIRTY_REPO` error code.
   *
   * @returns The generated error message.
   */
  DIRTY_REPO: (): string => {
    return 'the git repository is dirty.';
  },

  /**
   * Generates the error message for the `NO_SPECIFIED_TASKS` error code.
   *
   * @param phase The phase that was specified.
   * @returns The generated error message.
   */
  NO_SPECIFIED_TASKS: (phase: 'pre' | 'post'): string => {
    return `no tasks were specified for the ${phase}-bump phase.`;
  },
};

export class BumpError<T extends keyof typeof ErrorCodes> extends Error {
  /**
   * The code that represents the thrown error.
   *
   * This property will represent the thrown error's code, which can be used to
   * handle the error in a specific way if desired.
   */
  public code: T;

  /**
   * Represents any arguments that relates to the error code.
   *
   * If the thrown error takes arguments, this property will represent the
   * arguments passed to the message generator. These arguments can be
   * referenced to provide more information about the error during handling.
   */
  public args: Parameters<(typeof Messages)[T]>;

  /**
   * Initializes a new `BumpError` instance.
   *
   * @param code The code for the error.
   * @param args Any arguments to pass to the error code.
   */
  public constructor(code: T, ...args: Parameters<(typeof Messages)[T]>) {
    const message: string = (Messages[code] as (...args: any[]) => string)(...(args as any[])) as string;

    super(message);

    this.code = code;
    this.args = args;
  }

  /**
   * Determines the specific type of error that occured.
   *
   * When catching an instance of `BumpError`, by default the type of the
   * error is unknown. `is` implements a type guard to determine the specific
   * type of error that occured, which can be used to handle the error in a
   * specific way.
   * @param code The code to check against.
   * @returns `true` if the error code matches the code passed to the function,
   * @example
   * ```ts
   * try {
   *   /* ... *\/
   * }
   *
   * catch (error) {
   *   if (error instanceof BumpError) {
   *     if (error.is(ErrorCodes.INVALID_JSON)) {
   *       /* `INVALID_JSON` error *\/
   *     }
   *
   *     /* Unknown `BumpError` error *\/
   *   }
   * }
   * ```
   *
   * In the example above, the `is` check ensures that the error thrown is the
   * error `INVALID_JSON`. This informs us of the error code and also
   * allows us to safely access the `args` property of the error.
   */
  public is<T extends ErrorCodes>(code: T): this is BumpError<T> {
    return (this.code as keyof typeof ErrorCodes) === code;
  }

  public static Is<T extends ErrorCodes>(error: unknown, code: T): error is BumpError<T> {
    return error instanceof BumpError && error.is(code);
  }
}
