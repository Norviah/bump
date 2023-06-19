export const git = {
  /**
   * Simply prints the version of git.
   *
   * This is essentially used to check if git is installed on the user's
   * machine, if the command failes, we'll assume that git is not installed.
   */
  VERSION: 'git --version',

  /**
   * Get information regarding the repository's URL.
   */
  URL: 'git remote get-url origin',

  /**
   * Prints information regarding each commit in the repository.
   *
   * This command will return information regarding each commit in a line,
   * information such as the commit's hash, date, tag, and subject, with each
   * piece of information being separated by a `|`.
   */
  HISTORY: "git log --pretty='%h|%ad|%d|%s' --date short",

  /**
   * Gets the status of the repository.
   *
   * Similar to the `VERSION` command, this command is used to check if the
   * current working directory is a git repository.
   */
  STATUS: 'git status',

  /**
   * Gets the root directory of the repository.
   */
  ROOT: 'git rev-parse --show-toplevel',
};
