import { run } from '@/util/run';
import * as scripts from '@/util/scripts';

export class Git {
  /**
   * Determines if git is installed on the user's system.
   *
   * We'll simply check if git is installed by running the `git --version`
   * command, ensuring that the command does not throw an error.
   * @returns Whether if git is installed.
   */
  public static IsInstalled(): boolean {
    try {
      return Boolean(run(scripts.git.VERSION));
    } catch {
      return false;
    }
  }

  /**
   * Initializes an array consisting of every commit within the git repository.
   *
   * We'll use the `git log` command to get a list of every commit in the
   * repository, with each commit being in the format of:
   * <commit hash>|<date>|<tag>|<subject>
   * @returns The log of every commit within the git repository.
   */
  public static History(): string[] {
    return run(scripts.git.HISTORY).split('\n');
  }

  /**
   * Generates a link to compare two tags.
   *
   * @param URL The base URL of the git repository.
   * @param previous The previous tag.
   * @param current The current tag.
   * @returns The generated link to compare the two provided tags.
   */
  public static GenerateCompareLink(URL: string, previous: string, current: string): string {
    return `${URL}/compare/${previous}...${current}`;
  }
}
