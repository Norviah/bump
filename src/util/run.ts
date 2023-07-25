import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { command as exec } from 'execa';

import type { ExecaError } from 'execa';

/**
 * Executes a shell script and returns the output.
 *
 * @param command The command to execute.
 * @param options Options for the script execution.
 * @param timeout Timeout in milliseconds after which the command will be
 * terminated.
 * @returns The output of the command.
 */
export async function run(command: string, options?: { root?: string; timeout: number }): Promise<string> {
  try {
    const response = await exec(command, {
      cwd: options?.root,
      timeout: options?.timeout,
    });

    return `${response.stdout.trim()}\n${response.stderr.trim()}`.trim();
  } catch (error) {
    throw new BumpError(ErrorCodes.SCRIPT_ERROR, error as ExecaError);
  }
}
