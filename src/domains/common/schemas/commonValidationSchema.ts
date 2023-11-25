import { z } from 'zod';

export const uuidV4Schema = z.string().length(36);
