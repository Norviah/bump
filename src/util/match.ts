import type { RegexGroups } from '@/types/Groups';

/**
 * Matches a string with a regular expression and returns the groups.
 *
 * @param expression The regular expression to match.
 * @param string The string to match against.
 * @returns A typed object representing the groups within the string, or `null`
 * if no match was found.
 * @example
 * ```ts
 * const num = '(?<country>\\d{1,3})-(?<area>\\d{3})-(?<number>\\d{3}-\\d{4})';
 * match(num, '1-800-555-1234');
 * ```
 * By calling the `match` function with the above expression and string, the
 * following type is returned:
 * ```ts
 * interface Result {
 *   country?: string;
 *   area?: string;
 *   number?: string;
 * }
 * ```
 */
export function match<T extends string>(expression: T, string: string): RegexGroups<T> | null {
  const match: RegExpMatchArray | null = string.match(new RegExp(expression));

  if (!match || !match.groups) {
    return null;
  }

  return { ...match.groups } as RegexGroups<T>;
}
