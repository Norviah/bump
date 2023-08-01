/**
 * Represents a handlebar.
 *
 * Handlebars is a simple templating syntax, which is represented by the
 * format: `{{string}}`, where the contents of `string` is defined to be
 * replaced by a value.
 *
 * @see https://handlebarsjs.com/guide/#what-is-handlebars
 */
export type Handlebar = `{{${string}}}`;
