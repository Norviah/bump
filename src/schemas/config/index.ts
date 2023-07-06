import { z } from 'zod';
import { Task } from './Task';
import { CommitType } from './CommitType';

export const Object = z.object({
  /**
   * Represents a task to run within a specific step of the release process.
   *
   * `bump` is a command-line tool that simplifies the process of releasing
   * software, the tool separates the process of what to do before and after the
   * version is incremented.
   *
   * Within these steps, you can specify a list of tasks to run, these tasks
   * represent what bash command to run, which will be executed in the root of
   * the project.
   */
  tasks: z.object({
    /**
     * The list of tasks to run before the version is incremented.
     */
    pre: z.array(Task),

    /**
     * The list of tasks to run after the version is incremented.
     */
    post: z.array(Task),
  }),

  /**
   * An array of explicit commit types to support.
   */
  types: z.array(CommitType).optional(),

  /**
   * The header to use for unreleased commits.
   *
   * When generating a changelog, the tool will group commits into sections
   * as represented by the release the commit is included in. Naturally, there
   * will be commits that are not yet released, this options allows you to
   * specify the title to use for that specific section.
   */
  unreleasedHeader: z.string().default('Unreleased'),

  /**
   * Whether to include a commit's body when generating the line for a commit.
   *
   * Sometimes, a commit's body can further specify the commit's intent and
   * purpose. If desired, the commit's body will be included under the
   * commit's subject when generating the changelog.
   */
  includeBody: z.boolean().default(false),

  /**
   * Whether to include non-conventional commits when generating the
   * changelog.
   */
  includeNonConventionalCommits: z.boolean().default(true),
});

export type Object = z.infer<typeof Object>;

export { Task, CommitType };
