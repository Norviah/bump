import { Command } from '@/structs/Command';

import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const SCRIPT: string = `#!/bin/sh
#
# A hook to verify the commit message format, which ensures that commit messages
# follow the conventional commit format.
#
# To ensure this hook can run, make sure it has execute permissions:
# chmod +x .git/hooks/prepare-commit-msg

COMMIT_MSG_FILE=$1

PATTERN="^(\\w+)(\\((.*)\\))?\\s?(!)?\\s?:\\s?(.*)$"

# Read the commit message
COMMIT_MSG=$(cat $COMMIT_MSG_FILE)

# Check if the commit message matches the pattern
if ! [[ $COMMIT_MSG =~ $PATTERN ]]; then
  echo "
The specified commit message is invalid, it must follow the conventional commit
format.

Please see here for more details: https://www.conventionalcommits.org/en/v1.0.0/#summary"

  exit 1
fi`;

/**
 * The `hook` command.
 *
 * This command installs a `prepare-commit-msg` hook to ensure that commits are
 * semantic and follow the conventional commit format.
 *
 * @example
 * ```sh
 * $ bump hook
 * ```
 */
export default class Hook extends Command<typeof Hook> {
  /**
   * The command's summary.
   *
   * A small, brief description regarding the command and its purpose. This
   * summary is displayed when the user asks for help regarding the command.
   */
  public static summary: string = 'Installs a hook to ensure that commit messages are semantic.';

  /**
   * The command's description.
   *
   * A more detailed description regarding the command, this should thoroughly
   * describe the command and its purpose.
   */
  public static description: string = `This command installs a \`prepare-commit-msg\` 
  hook to ensure that commits are semantic and follow the conventional commit
  format.`;

  /**
   * The command's execution logic.
   */
  public async run(): Promise<void> {
    const hookPath: string = join(this.rootPath, '.git/hooks/prepare-commit-msg');

    // First, we'll check to see if the user has already installed a hook.
    if (existsSync(hookPath)) {
      // If they have, we'll read the contents of the hook.
      const hook: string = readFileSync(hookPath).toString();

      // If the hook is the same as the one we want to install, we'll just
      // return early.
      if (hook === SCRIPT) {
        return this.info('the hook has already been installed');
      }

      const response = await this.prompt(`there already exists a hook at ${hookPath}, would you like to overwrite it? [y/N]`);

      if (!['y', 'yes'].includes(response.toLowerCase())) {
        return this.info('command cancelled');
      }
    }

    // Finally, we'll write the hook to the file.
    writeFileSync(hookPath, SCRIPT);

    // If the user not on Windows, we'll make sure that the hook is executable.
    // For Windows, I'm not sure what happens when comitting.
    if (!this.config.windows) {
      execSync(`chmod +x ${hookPath}`);
    } else {
      this.info('as you are on Windows, you will need to ensure that the hook executes correctly');
    }

    this.success('hook installed');
  }
}
