export interface Paths {
  /**
   * The root path for the project that the command-line tool is being used in.
   *
   * The command-line tool is enforced to be used within a git repository, so
   * the root path will represent the root directory for the git repository.
   */
  root: string;

  /**
   * The path to the configuration file.
   */
  config: string;
}
