import { z } from 'zod';

export const Link = z.string().url();
export type Link = z.infer<typeof Link>;
