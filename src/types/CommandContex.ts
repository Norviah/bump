import type { Object as Config } from '@/schemas/config';

/**
 * Represents the context of a command's execution.
 *
 * When a command is executed within this project, it is always provided with a
 * `CommandContext` instance which provides important information regarding the
 * context the command's execution.
 *
 * It provides information such as the command-line tool's configuration object
 * and important paths, such as the root path of the project the command was
 * executed in.
 */
export interface CommandContext {
  /**
   * The command-line tool's configuration object.
   *
   * Within the root directory of the project where the command-line tool was
   * executed, there is a configuration file that stores the settings and
   * options that alters how the command-line tool behaves.
   *
   * This property will reference that configuration file after it has been
   * parsed and validated.
   */
  config: Config;

  /**
   * The root path of the project where the command-line tool was executed.
   *
   * If the command was executed within a git repository, this property will
   * reflect the root directory as specified by git, that is, the root
   * directory of where the `.git` directory is located.
   *
   * Otherwise, this property will reflect the current working directory.
   */
  rootPath: string;
}
