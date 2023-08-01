import { Read } from '@/structs/Read';
import { writeFileSync } from 'fs';
import { BaseProvider } from './BaseProvider';

import * as schemas from '@/schemas';

import type { JsonObject } from 'type-fest';

/**
 * The provider for JSON files.
 *
 * `JsonProvider` is the provider that handles the logic for reading and writing
 * the project's version to and from a JSON file.
 */
export class JsonProvider extends BaseProvider<'json'> {
  /**
   * Gets the current version of the project.
   *
   * As this structure handles JSON files, this method will attempt to import
   * the JSON file and parse the version from the file.
   */
  public version(): schemas.SemVer | never {
    const { key } = this.config.provider;

    const json: JsonObject = Read.JSON(this.file);

    try {
      return schemas.SemVer.parse(json[key]);
    } catch {
      throw new Error(`the key \`${key}\` within the JSON file does not contain a valid semantic version: ${json[key]}`);
    }
  }

  /**
   * Saves the specified version to the JSON file.
   *
   * This method is called after the project's version has been bumped, and is
   * responsible for implementing the logic for writing the new version into the
   * provider's respective medium.
   *
   * As this provider handles JSON files, this method will parse the JSON file
   * and update the version within the file.
   * @param version The version to save to the JSON file.
   */
  public save(version: schemas.SemVer): void {
    // Initially, we'll need to import the JSON object to update the version
    // within the object.
    const json: JsonObject = Read.JSON(this.file);

    // Now that we have the JSON object, we can update the version within the
    // object.
    json[this.config.provider.key] = version;

    // Finally, we'll need to write the JSON object back to the file.
    writeFileSync(this.file, JSON.stringify(json, null, 2));
  }
}
