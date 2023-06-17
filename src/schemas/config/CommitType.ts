import { z } from 'zod';

export const CommitType = z.object({
  /**
   * The commit's respective type.
   *
   * This string should be the same as the same `type` defined in the respective
   * commit message.
   */
  type: z.string(),

  /**
   * The respective scope to match.
   *
   * This string should also match the same `scope` string defined in the
   * respective commit message, it can be used to further specify which commit
   * type to reference.
   */
  scope: z.string().optional(),

  /**
   * Whether if matched commits should not be included within the changelog.
   */
  hidden: z.boolean().default(false),

  /**
   * The name to use when displaying the type within the changelog.
   *
   * When generating the changelog, the inferred `type` of the commit will be
   * used to reference the respective commits under that type, if desired, this
   * string can be implemented to override that string.
   */
  name: z.string().optional(),
});

export type CommitType = z.infer<typeof CommitType>;
