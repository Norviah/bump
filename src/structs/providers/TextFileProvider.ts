import { Read } from '@/structs/Read';
import { BaseProvider } from '@/structs/providers';
import { writeFileSync } from 'fs';

import * as schemas from '@/schemas';

/**
 * The provider for text files.
 *
 * `TextFileProvider` is the provider used if the user has specified that the
 * project's version is stored within a text file. This provider will handle the
 * logic for reading and writing the project's version to and from the text
 * file.
 */
export class TextFileProvider extends BaseProvider<'text'> {
  /**
   * Gets the current version of the project.
   *
   * As this is the text file provider, this method will read the project's
   * version from the specified text file. When reading the file, it's assumed
   * that the file contains **only** the version, and nothing else.
   *
   * @returns The current version of the project from the text file.
   */
  public version(): schemas.SemVer | never {
    const content: string = Read.Text(this.file).trim();

    try {
      return schemas.SemVer.parse(content);
    } catch {
      throw new Error(`the version specified within the text file is not a valid semantic version: ${content}`);
    }
  }

  /**
   * Saves the specified version to the text file.
   *
   * This method is responsible for writing the new version of the project's
   * version to the provider's respective medium, as this provider handles text
   * files, this method will write the version to the text file.
   *
   * @param version The version to save to the text file.
   */
  public save(version: schemas.SemVer): void {
    writeFileSync(this.file, version);
  }
}
