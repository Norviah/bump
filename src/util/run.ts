import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { execSync } from 'child_process';

import type { SpawnSyncReturns } from 'child_process';

/**
 * Executes a shell script and returns the output.
 *
 * @param command The command to execute.
 * @returns The output of the command.
 */
export function run(command: string): string {
  try {
    return execSync(`${command} 2>/dev/null`, { encoding: 'utf-8' }).toString().trim();
  } catch (error) {
    throw new BumpError(ErrorCodes.SCRIPT_ERROR, error as SpawnSyncReturns<string>);
  }
}
