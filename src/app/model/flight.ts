import { z } from 'zod';

export const FlightSchema = z.object({
  id: z.coerce.number().int(),
  from: z.string().min(3),
  to: z.string().min(3),
  date: z.coerce.date(),
  delayed: z.coerce.boolean(),
});

export type Flight = z.infer<typeof FlightSchema>;

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: new Date(0),
  delayed: false,
};
