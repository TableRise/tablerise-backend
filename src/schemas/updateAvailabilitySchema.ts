import { z } from 'zod';

const updateAvailabilityZodSchema = z.object({
    active: z.boolean(),
});

export type UpdateAvailability = z.infer<typeof updateAvailabilityZodSchema>;
export default updateAvailabilityZodSchema;
