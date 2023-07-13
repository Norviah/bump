import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { existsSync, readFileSync, statSync } from 'fs';
import { extname } from 'path';

import type { JsonObject } from 'type-fest';

/**
 * Provides methods for reading files.
 *
 * This class is used to read files from the file system, it provides methods
 * for reading data from various file types, additionally implementing error
 * handling and validation.
 */
export abstract class Read {
  /**
   * Imports the contents of the specified text file.
   *
   * @param path The path to the text file.
   * @returns The contents of the text file.
   */
  public static Text(path: string): string | never {
    if (!existsSync(path)) {
      throw new BumpError(ErrorCodes.MISSING_TEXT_FILE, path);
    } else if (statSync(path).isDirectory() || extname(path) !== '.txt') {
      throw new BumpError(ErrorCodes.NON_TEXT_FILE, path);
    }

    return readFileSync(path, 'utf-8');
  }

  /**
   * Imports the contents of the specified JSON file.
   *
   * @param path The path to the JSON file.
   * @returns The contents of the JSON file.
   */
  public static JSON(path: string): JsonObject | never {
    if (!existsSync(path)) {
      throw new BumpError(ErrorCodes.MISSING_JSON_FILE, path);
    } else if (statSync(path).isDirectory() || extname(path) !== '.json') {
      throw new BumpError(ErrorCodes.NON_JSON_FILE, path);
    }

    try {
      return JSON.parse(readFileSync(path, 'utf-8'));
    } catch {
      throw new BumpError(ErrorCodes.INVALID_JSON, path);
    }
  }
}
