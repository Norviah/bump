import { simpleGit } from 'simple-git';
import type { SimpleGit } from 'simple-git';

/**
 * The git client used for the application.
 *
 * This client is used to simplify the process of interacting with git
 * programmatically.
 * @see https://github.com/steveukx/git-js#simple-git
 */
export const git: SimpleGit = simpleGit();
