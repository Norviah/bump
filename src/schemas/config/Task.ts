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

  /**
   * Whether if the tool should show a spinner while the task is running.
   *
   * The issue with spinners is that they refresh the terminal, which can cause
   * issues such as flickering - but the main issue is that if the script
   * requires user input, the text will be erased.
   *
   * Enabling this option will disable the spinner for this task, allowing any
   * information presented by the script to be displayed.
   */
  noSpinner: z.boolean().default(false),
});

export type Task = z.infer<typeof Task>;
