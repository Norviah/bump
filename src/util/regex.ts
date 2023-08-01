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
 *
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */
export const CONVENTIONAL_COMMIT = '^(?<type>\\w+)(?:\\((?<scope>.*)\\))?\\s?(?<breaking>!)?\\s?:\\s?(?<description>.*)$';

/**
 * Matches an issue reference within a string.
 *
 * In GitHub, and possibly other platforms, issues are assigned a unique ID and
 * can be referenced within commit messages as `#<id>`. This expression will
 * match an issue references within a string and capture the ID into a group.
 */
export const ISSUES = '#(?<id>\\d+)';

/**
 * Matches a string in the format of a semantic version.
 *
 * Semantic versioning is a convention that defines version numbers to be
 * structured within a format, in order to communicate the nature of the version
 * in a standardized way.
 *
 * @see https://semver.org/
 */
export const SEMVER = /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)$/;

export const git = {
  /**
   * Matches and extracts the tag from a git log.
   *
   * When printing logs from a git repository, tags are printed within the
   * format of `tag: <tag>`. This expression will match a string in this form
   * and capture the tag into a group.
   */
  TAG: 'tag:\\s*(?<version>[^,\\s]+)',

  /**
   * Matches the structure of an SSH URL.
   *
   * This expression will match a string in the form of an SSH URL and capture
   * the host, owner, and repository into groups.
   */
  SSH_URL: '^(?<git>git)@(?<host>.*\\.com):(?<owner>.*)\\/(?<repo>.*).git',
} as const;
