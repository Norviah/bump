import type { Handlebar } from '@/types/Handlebar';

/**
 * Replaces all instances of the provided handlebars with the specified
 * replacement.
 *
 * @param string The string to replace the handlebars in.
 * @param replacements The replacements to use.
 * @returns The string with the replaced handlebars.
 * @example
 * ```ts
 * replace('hello {{noun}}', { '{{noun}}': 'world' }); // => 'hello world'
 * ```
 */
export function replace(string: string, replacements: Record<Handlebar, string>): string {
  return Object.entries(replacements).reduce((acc, [key, value]) => acc.replace(new RegExp(key, 'g'), value), string);
}
