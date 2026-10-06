import * as z from "zod";

export const profileIdSchema = z.object({
    id: z.uuid()
});

export const profileNameSchema = z
    .string()
    .trim()

const createProfileSchema = z.object({
    user_id: z.uuid(),
    name: profileNameSchema
});

export const listProfilesSchema = z.object({
    name: profileNameSchema.optional(),
});

export const updateProfileSchema = z.object({
    name: profileNameSchema
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type ListProfilesInput = z.infer<typeof listProfilesSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

