import { BumpError, ErrorCodes } from '@/structs/BumpError';
import { existsSync, readFileSync, statSync } from 'fs';
import { extname } from 'path';

import type { JsonObject } from 'type-fest';

/**
 * Imports a JSON file from the specific path.
 *
 * @param path The path to the JSON file.
 * @returns The imported JSON object.
 */
export function read(path: string): JsonObject {
  if (!existsSync(path)) {
    throw new BumpError(ErrorCodes.MISSING_JSON_FILE, path);
  } else if (statSync(path).isDirectory() || extname(path) !== '.json') {
    throw new BumpError(ErrorCodes.NON_JSON_FILE, path);
  }

  let json: JsonObject;

  try {
    json = JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    throw new BumpError(ErrorCodes.INVALID_JSON, path);
  }

  return json;
}
