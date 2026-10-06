import * as z from "zod";
import { createUserSchema } from "./user-schema";
import { profileNameSchema } from "./profile-schema";

export const createAccountSchema = z.object({
    user: createUserSchema,
    profile: z.object({
        name: profileNameSchema
    })
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
