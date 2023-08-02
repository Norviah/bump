import { z } from 'zod';

import { CommitOption } from './CommitOption';
import { Provider } from './Provider';
import { Task } from './Task';

export const Object = z.object({
  /**
   * Represents the various phases within the bump process, and the tasks to run
   * within each phase.
   *
   * The bump process is divided into three phases:
   *
   *   1. Pre-bump - the phase before the version is incremented,
   *   2. Bump - where the version is incremented,
   *   3. Post-bump - the phase after the version is incremented.
   *
   * Within these phases, the user can specify a list of scripts to run, which
   * are bash commands that are executed in the root of the project.
   */
  tasks: z.object({
    /**
     * The list of tasks to run before the version is incremented.
     */
    pre: z.array(Task).default([]),

    /**
     * The list of tasks to run after the version is incremented.
     */
    post: z.array(Task).default([]),
  }),

  /**
   * The method used to access the project's version number.
   *
   * Providers are methods of retrieving the version number from a specific type
   * of file, such as a JSON or text file. Each provider has a respective
   * structure that implements the logic for retrieving and updating the version
   * number.
   *
   * Through this provider, the command-line tool can retrieve and update the
   * version number.
   */
  provider: Provider,

  /**
   * Options to reference for commits when generating a changelog.
   *
   * When generating a changelog, the command-line tool will group commits under
   * a release into sections determined the commit's type -- assuming the commit
   * follows the conventional commit format.
   *
   * If desired, the user can specify options for various types of commits,
   * which determines how the list of commits under that type are displayed
   * within the changelog.
   */
  types: z.array(CommitOption).optional(),

  /**
   * Whether to prompt the user for confirmation before releasing a new version.
   *
   * This option is useful as a safety net to prevent accidental releases, if
   * enabled, the `release` command will prompt the user to confirm before
   * continuing with the release.
   *
   * This option only applies to the `release` command, and if desired, the user
   * can specify the `--force` flag to bypass this prompt.
   */
  prompt: z.boolean().default(false),

  /**
   * The string to use for the unreleased section within the changelog.
   *
   * When generating a changelog, the command-line tool will group commits into
   * sections determined by the release the commit is under. With each section,
   * the header of the section is determined by the release's tag.
   *
   * Naturally, there may be commits not yet released, this option allows the
   * user to specify the header to use for that specific section.
   */
  unreleasedHeader: z.string().default('Unreleased'),

  /**
   * The string to use for the section in the changelog that contains breaking
   * changes.
   *
   * Within a release, there may be commits that introduce breaking changes,
   * these commits are printed under their type as normal, in addition to being
   * printed under a section representing breaking changes.
   *
   * This option allows the user to specify the header to use for that specific
   * section.
   */
  breakingHeader: z.string().default('⚠ Breaking Changes'),

  /**
   * Whether to include a commit's body when generating the changelog.
   *
   * A commit's body may contain additional information regarding the commit's
   * intent and purpose, if desired, this option can be enabled to include the
   * commit's body when generating the changelog.
   */
  includeBody: z.boolean().default(false),

  /**
   * Whether to include non-conventional commits when generating the
   * changelog.
   *
   * This command-line tool assumes that commits follow the conventional commit
   * format, which it uses aspects of the commit to implement its functionality.
   *
   * An example being the commit's type, the command-line tool uses the commit's
   * type to determine which sub-section to group commits under when generating
   * the changelog.
   *
   * Commit subjects that do not follow this format are instead grouped under
   * the section, not under a subheader. If desired, this option can be enabled
   * to remove non-conventional commits from the changelog altogether.
   */
  includeNonConventionalCommits: z.boolean().default(true),

  /**
   * The string to use when creating a tag for a release.
   *
   * When creating a tag for a release, the command-line tool will use this
   * string as the tag's name.
   *
   * The following placeholders are available for use:
   *   - `{{before}}`: the version before the release,
   *   - `{{after}}`: the version after the release.
   */
  tag: z.string().default('v{{after}}'),

  /**
   * The message to use when creating a release commit.
   *
   * The following placeholders are available for use:
   * - `{{before}}`: the version before the release,
   * - `{{after}}`: the version after the release,
   * - `{{tag}}`: the actual tag used for the release.
   */
  releaseSubject: z.string().default('chore(release): {{tag}}'),

  /**
   * The subject for the commit when generating a changelog after a release.
   *
   * The following placeholders are available for use:
   * - `{{before}}`: the version before the release,
   * - `{{after}}`: the version after the release,
   * - `{{tag}}`: the actual tag used for the release.
   */
  changelogSubject: z.string().default('docs(changelog): {{tag}}'),
});

/**
 * The type of the `Object` schema.
 *
 * @template P The specific provider to extract.
 */
export type Object = z.infer<typeof Object>;

/**
 * Extracts the provider from the `Object` schema.
 *
 * @template T The specific provider to extract.
 */
type InferProvider<T extends Provider['type']> = Readonly<
  Omit<Object, 'provider'> & {
    provider: Extract<Object['provider'], { type: T }>;
  }
>;

export { CommitOption, Provider, Task, InferProvider };
