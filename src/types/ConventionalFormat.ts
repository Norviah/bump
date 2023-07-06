export interface ConventionalFormat {
  /**
   * The commit's type.
   */
  type: string;

  /**
   * The commit's scope.
   */
  scope: string | undefined;

  /**
   * Whether the commit is a breaking change.
   */
  breaking: boolean;

  /**
   * The commit's description.
   */
  description: string;
}
