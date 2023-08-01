import { z } from 'zod';

const JsonProvider = z.object({
  /**
   * The type of provider.
   */
  type: z.literal('json'),

  /**
   * The path to the JSON file that contains the version number.
   */
  path: z.string(),

  /**
   * The key in the JSON file that references the version number.
   */
  key: z.string().default('version'),
});

const TextFileProvider = z.object({
  /**
   * The type of provider.
   */
  type: z.literal('text'),

  /**
   * The path to the text file that contains the version number.
   */
  path: z.string(),
});

export const Provider = z.union([JsonProvider, TextFileProvider]);
export type Provider = z.infer<typeof Provider>;
