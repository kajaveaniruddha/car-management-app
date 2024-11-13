import { z } from 'zod';

export const carSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  images: z.array(z.string().url()).max(10),
});
