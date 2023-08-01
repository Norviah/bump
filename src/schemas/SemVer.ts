import { z } from 'zod';

import * as regex from '@/util/regex';

/**
 * Represents a semantic version number.
 *
 * A semantic version number is a string in the format of: `major.minor.patch`,
 * where each of the three parts is a number, for example: `1.2.3`.
 *
 * The goal of semantic versioning is to make it easy to tell the difference
 * between two versions of a project.
 *
 * @see https://semver.org/
 */
export const SemVer = z.custom<`${number}.${number}.${number}`>((input: unknown) => {
  return typeof input === 'string' && regex.SEMVER.test(input as string);
});

export type SemVer = z.infer<typeof SemVer>;
