import type { Explicit } from './Explicit';

/**
 * Merges an interface with a subset of its keys, making the specified
 * properties required and non-nullable.
 *
 * @template T The interface to merge.
 * @template K The union of keys from `T` to make required and non-nullable.
 * @example
 * As an example, let's say we have an interface `Person` with the optional
 * properties `job` and `school`:
 * ```ts
 * interface Person {
 *   name: string;
 *   job?: string;
 *   school?: string;
 * }
 * ```
 *
 * If we want to make an instance of `Person`, where the `job` property is
 * required, we can use `With`:
 * ```ts
 * type PersonWithJob = With<Person, 'job'>;
 * ```
 *
 * Now when we create an instance of `PersonWithJob`, we will get an error if we
 * do not provide a value for `job`:
 * ```ts
 * const person: PersonWithJob = {
 *   name: 'John Doe',
 *   job: undefined,
 * }; // Error as `job` is required
 * ```
 */
export type With<T extends Record<string, any>, K extends keyof T> = T & {
  [P in keyof Explicit<T>]: P extends K ? NonNullable<T[P]> : T[P];
};
