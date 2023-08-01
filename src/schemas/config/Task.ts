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
   * The bash script to run.
   */
  command: z.string(),

  /**
   * How long (in milliseconds) to wait before terminating the command.
   *
   * If a task takes longer than this amount of time to run, an error will be
   * thrown and the release process will be aborted.
   */
  timeout: z.number().default(15000),
});

export type Task = z.infer<typeof Task>;
