import { z } from 'zod';

/**
 * Represents a release type.
 *
 * Determines the release types that are supported by this command-line tool,
 * which simply corresponds to the three parts of a semantic version number.
 */
export const Release = z.enum(['major', 'minor', 'patch']);

export type Release = z.infer<typeof Release>;
