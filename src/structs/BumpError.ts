export enum ErrorCodes {
  /**
   * The event where an invalid JSON file was provided.
   */
  INVALID_JSON = 'INVALID_JSON',
}

const Messages = {
  /**
   * Generates the error message for the `INVALID_JSON` error code.
   *
   * @param path The path to the JSON file.
   * @returns The generated error message.
   */
  INVALID_JSON: (path: string): string => {
    return `the JSON file at \`${path}\` is invalid.`;
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
    super(Messages[code](args as any) as string);

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
}
