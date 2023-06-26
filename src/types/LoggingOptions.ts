import type { Color } from 'chalk';

export interface LoggingOptions {
  /**
   * The title of the log.
   *
   * Logs may optionally have a title to provide more context to the log, if
   * specified, messages will be prefixed with the title, in the format of:
   * ```
   * title: message
   * ```
   */
  title?: string;

  /**
   * Specify colors for various aspects of the log.
   *
   * By default, the colors of the title and message are white, however, this
   * can be changed by specifying the desired colors within this object.
   */
  colors?: {
    /**
     * The color of the title.
     */
    title?: typeof Color;

    /**
     * The color of the message.
     */
    message?: typeof Color;
  };
}
