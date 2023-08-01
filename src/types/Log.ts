import type { DefaultLogFields, ListLogLine } from 'simple-git';
import type { RegexGroups } from './Groups';
import type { With } from './ts/With';

import type * as regex from '@/util/regex';

/**
 * Represents the base log object returned by `simple-git`.
 *
 * This object contains information regarding a specific commit, such as the
 * commit's hash, date, author, and message.
 * @see https://github.com/steveukx/git-js#git-log
 */
export type BaseLog = DefaultLogFields &
  ListLogLine & {
    short_hash: string;
    merge: string;
  };

/**
 * Represents an object that references information of a commit in addition to
 * respecting the conventional commit specification.
 *
 * `Log` extends the `BaseLog` type which modifies the `message` property to
 * reflect whether if the commit's message is in a conventional format.
 * Conventional commit messages are formatted in a specific way, which is:
 * ```
 * <type>[optional scope]: <description>
 * ```
 * This format allows for tools to parse commit messages more easily, if a
 * commit's message is in this format, the `message` property will be an object
 * that references the different parts, otherwise, `message` will be a string.
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */
export type ConventionalLog = Omit<BaseLog, 'message'> & {
  /**
   * An object that references aspects of the commit's subject, which is in a
   * conventional format.
   *
   * A commit's subject is in a conventional format if it follows the following
   * format:
   * ```
   * <type>[optional scope]: <description>
   * ```
   *
   * This subject is parsed and converted to an object under the `message`
   * property, which will reference the different parts of the subject.
   */
  message: Omit<With<RegexGroups<(typeof regex)['CONVENTIONAL_COMMIT']>, 'type'>, 'breaking'> & { breaking: boolean };
};

export type Log = BaseLog | ConventionalLog;
