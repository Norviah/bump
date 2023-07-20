import chalk from 'chalk';

import type { Color } from 'chalk';
import type { LoggingOptions } from '@/types/LoggingOptions';

export abstract class Logger {
  /**
   * Generates a formatted log message.
   *
   * @param message The message to log.
   * @param options The options to use when logging the message.
   * @returns The formatted log message.
   * @example
   * ```ts
   * Logger.Generate('world', { title: 'hello' }); // => 'hello world'
   * Logger.Generate('hello'); // => 'hello'
   * ```
   */
  public static Generate(message: string, options?: LoggingOptions): string {
    const colors: Required<LoggingOptions['colors']> = {
      title: 'blue',
      message: 'white',
      ...options?.colors,
    };

    return `${options?.title ? `${chalk[colors.title](options.title)} ` : ''}${chalk[colors.message](message)}`;
  }

  /**
   * Prints a formatted log message to the console.
   *
   * @param message The message to log.
   * @param options The options to use when logging the message.
   */
  public static Print(message: string, options?: LoggingOptions): void {
    console.log(Logger.Generate(message, options));
  }

  /**
   * Applies a color to the provided string.
   *
   * @param string The string to color.
   * @param color The desired color to apply.
   * @returns The provided string with the applied color.
   */
  public static Color(string: string, color: typeof Color): string {
    return chalk[color](string);
  }
}
