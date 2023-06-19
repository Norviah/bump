import type { Commit } from '@/types/Commit';

export interface Repo {
  /**
   * The URL of the git repository.
   */
  url: string;

  /**
   * An array consisting of every commit within the git repository.
   */
  commits: Commit[];
}
