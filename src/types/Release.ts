import type { RequireAllOrNone } from 'type-fest';
import type { Log } from './Log';

/**
 * Represents a release, which is a collection of commits that are associated
 * with a specific version.
 *
 * `Release` extends the `Log` interface, in addition to the `commits` property,
 * which represents the collection of commits that are associated with the
 * release. The other properties represents the information of the commit that
 * is associated with the release.
 *
 * Note: All properties inherited from `Log` are either all present or absent.
 * This wierd implementation is due to accommodate TypeScript's type system, if
 * those properties are present, then it represents a release that has been
 * released, otherwise, it represents commits that have not been released yet.
 */
export type Release = {
  /**
   * All commits that are part of the release.
   */
  commits: Log[];

  /**
   * The specific version of the release.
   */
  version: string;
} & RequireAllOrNone<Log, keyof Log>;
