/**
 * Make all properties in `T` explicitly need a value.
 *
 * Given an interface `T`, `Explicit` constructs a new interface where all
 * properties within the original interface are explicitly required. `Explicit`
 * differs from `Required` in that it will not make any optional properties
 * required, simply making all properties need to be explicitly provided.
 * @template T The provided interface.
 * @example
 * Here we have an interface that describes a person, with the `name` required
 * and the `job` optional.
 * ```ts
 * interface Person {
 *  name: string;
 *  job?: string;
 * }
 * ```
 * If we try to create an instance of `Required<Person>`, we will get an error
 * if we do not provide a value for `job`.
 * ```ts
 * const person: Required<Person> = {
 *   name: "John Doe",
 *   job: undefined,
 * }
 * ```
 * Instead, if we use `Explicit<Person>`, we will not get an error.
 * ```ts
 * const person: Explicit<Person> = {
 *   name: "John Doe",
 *   job: undefined,
 * }
 * ```
 */
export type Explicit<T extends Record<string, any>> = {
  [K in keyof Required<T>]: T[K];
};
