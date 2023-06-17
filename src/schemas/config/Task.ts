import { z } from 'zod';

export const Task = z.object({
  /**
   * The name of the task.
   *
   * This string is used to identify the task when running the task within the
   * release process.
   */
  name: z.string(),

  /**
   * The bash command to run.
   */
  command: z.string(),
});

export type Task = z.infer<typeof Task>;
