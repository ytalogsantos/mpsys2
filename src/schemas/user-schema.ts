import * as z from "zod";

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

const listUsersSchema = z.object({
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

const updateUserSchema = z.object({
    email: z
        .email()
        .optional(),
    password: z
        .string()
        .trim()
        .pipe(createPasswordSchema)
        .optional()
});


type CreateUserInput = z.infer<typeof createUserSchema>;
type ListUsersInput = z.infer<typeof listUsersSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type
{
    createPasswordSchema,
    CreateUserInput,
    ListUsersInput,
    UpdateUserInput
}
