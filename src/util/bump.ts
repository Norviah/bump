import type * as schemas from '@/schemas';

/**
 * Bumps the provided semantic version based on a release type.
 *
 * @param version The version to bump.
 * @param release The release type, represents the type of bump to perform.
 * @example
 * ```ts
 * bump('1.0.0', 'major'); // '2.0.0'
 * bump('1.0.0', 'minor'); // '1.1.0'
 * bump('1.0.0', 'patch'); // '1.0.1'
 * ```
 */
export function bump(version: schemas.SemVer, release: schemas.Release): schemas.SemVer {
  const [major, minor, patch] = version.split('.').map(Number);

  if (release === 'major') {
    return `${major + 1}.0.0`;
  } else if (release === 'minor') {
    return `${major}.${minor + 1}.0`;
  } else {
    return `${major}.${minor}.${patch + 1}`;
  }
}
