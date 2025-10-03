import { z } from 'zod';

export const FlightSchema = z.object({
  id: z.coerce.number().int(),
  from: z.string().min(3).max(20),
  to: z.string().min(3),
  date: z.string(),
  delayed: z.coerce.boolean(),
});

// export type Flight = z.infer<typeof FlightSchema>;
