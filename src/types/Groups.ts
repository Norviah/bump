/**
 * Constructs an interface using groups from a regular expression.
 *
 * @example
 * For an example, let's say we have a simple expression that matches a first
 * and last name:
 * ```ts
 * const expression = "^(?<firstName>[a-zA-Z]+) (?<lastName>[a-zA-Z]+)$";
 * ```
 *
 * If we were to use this type on that expression, we would get the following
 * type:
 * ```ts
 * type Name = RegexGroups<typeof expression>;
 * // type Name = {
 * //   firstName: string | undefined;
 * //   lastName: string | undefined;
 * // }
 * ```
 */
export type RegexGroups<S extends string> = S extends `${string}(?<${infer Name}>${infer Rest}`
  ? Record<Name, string | undefined> & RegexGroups<Rest>
  : Record<never, never>;
