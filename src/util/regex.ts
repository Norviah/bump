/**
 * Matches a string in the format of a conventional commit.
 *
 * The conventional commit specification is a convention that defines commit
 * messages to be structured within a format, in order to communicate the nature
 * of the commit in a standardized way.
 *
 * By having a standardized format, this provides benefits such as writing
 * automated tools. This expression will match a string in this form and capture
 * specific aspects of the commit into groups.
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */
export const CONVENTIONAL_COMMIT = '^(?<type>\\w+)(?:\\((?<scope>\\w+)\\))?\\s?(?<breaking>!)?\\s?:\\s?(?<description>.*)$';

export const git = {
  /**
   * Matches and extracts the tag from a git log.
   *
   * When printing logs from a git repository, tags are printed within the
   * format of `tag: <tag>`. This expression will match a string in this form
   * and capture the tag into a group.
   */
  TAG: '(tag: (?<tag>.*?)(?=\\)))',

  /**
   *
   */
  SSH_URL: '^git@(?<host>\\w+\\.\\w+):(?<owner>.*)/(?<repo>.*)\\.git$',
} as const;
