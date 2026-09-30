import * as z from "zod";

const profileIdSchema = z.object({
    id: z.uuid()
});

const profileNameSchema = z
    .string()
    .trim()

const createProfileSchema = z.object({

    user_id: z
        .uuid(),
    name: profileNameSchema

});

const listProfilesSchema = z.object({
    name: profileNameSchema
});

const updateProfileSchema = z.object({
    name: profileNameSchema
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type ListProfilesInput = z.infer<typeof listProfilesSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

