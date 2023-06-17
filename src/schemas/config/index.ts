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
});

export type Object = z.infer<typeof Object>;

export { Task, CommitType };
