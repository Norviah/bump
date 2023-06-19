export interface ConventionalFormat {
  /**
   * The commit's type.
   */
  type: string;

  /**
   * The commit's scope.
   */
  scope: string | undefined;

  /**
   * Whether the commit is a breaking change.
   */
  breaking: boolean;

  /**
   * The commit's description.
   */
  description: string;
}

export interface Commit {
  /**
   * The commit's hash.
   *
   * This is a unique identifier for the commit, to construct a URL to the
   * commit on GitHub, you can use the following format:
   * ```
   * https://github.com/[owner]/[repo]/commit/[hash]
   * ```
   */
  hash: string;

  /**
   * The commit's date.
   *
   * Represents when the commit was made, in the format of `YYYY-MM-DD`.
   */
  date: string;

  /**
   * If the commit has a tag, this property will refer to the tag.
   */
  tag: string | undefined;

  /**
   * Exposes aspects of the commit's subject into a more usable format.
   *
   * Ideally, the command-line tool expects the subject for commits to be in the
   * conventional specification, which formats subjects into a more usable
   * and processable format, in the following format:
   * ```
   * <type>[optional scope]: <description>
   * ```
   *
   * Using this format, we can parse and extract the various parts into an
   * object, if the subject does not follow this format, the subject will be
   * returned as a string.
   */
  subject: string | ConventionalFormat;
}
