import * as z from "zod";

export const userIdParamSchema = z.object({
    id: z.uuid()
});

const createPasswordSchema = z
    .string()
    .regex(/^(?=.{8,64}$)\S+$/);

const dateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/);

const userRoleSchema = z.enum(
    [
        "OPERATOR",
        "PROGRAMMER",
        "PLANNER",
        "GATEKEEPER",
        "ADMIN"
    ],
    { error: "Invalid user role." }
);

const createUserSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .trim()
        .pipe(createPasswordSchema)
});

export const listUsersSchema = z.object({
    role: z
        .string()
        .trim()
        .pipe(userRoleSchema)
        .optional(),
    active: z
        .boolean()
        .optional(),
    created_at: z
        .string()
        .trim()
        .pipe(dateSchema)
        .optional()
});

export const updateUserSchema = z.object({
    email: z
        .email()
        .optional(),
    password: z
        .string()
        .trim()
        .pipe(createPasswordSchema)
        .optional()
});


export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ListUsersInput = z.infer<typeof listUsersSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
