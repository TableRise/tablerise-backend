import { z } from 'zod';

const suggestedZodSchema = z.object({
  personalityTrait: z.array(z.string()),
  ideal: z.array(z.string()),
  bond: z.array(z.string()),
  flaw: z.array(z.string())
});

const characteristicsZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  suggested: suggestedZodSchema
});

const backgroundZodSchema = z.object({
  name: z.string(),
  description: z.string(),
  skillProficiences: z.array(z.string()),
  languages: z.array(z.string()),
  equipment: z.array(z.string()),
  characteristics: characteristicsZodSchema
});

export type Background = z.infer<typeof backgroundZodSchema>;
export type BackgroundCharacteristics = z.infer<typeof characteristicsZodSchema>;
export type BackgroundSuggested = z.infer<typeof suggestedZodSchema>;

export default backgroundZodSchema;
