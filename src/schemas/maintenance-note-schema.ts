import * as z from "zod";

const maintenanceNotePriority = z.enum(
    [
        "LOW",
        "AVERAGE",
        "HIGH",
        "URGENT"
    ]
);

const maintenanceNoteStatus = z.enum(
    [
        "OPEN",
        "PLANNING",
        "PROGRAMMING",
        "EXECUTING",
        "DONE",
        "CLOSED"
    ]
);

export const maintenanceNoteIdParamSchema = z.object({
    id: z.uuid(),
});

const maintenanceNoteStatusSchema = z
    .string()
    .trim()
    .pipe(maintenanceNoteStatus);

const maintenanceNotePrioritySchema = z
    .string()
    .trim()
    .pipe(maintenanceNotePriority);

export const createMaintenanceNoteSchema = z.object({
    title: z.string(),
    description: z.string().max(200),
    profile_id: z.uuid()
});

export const updateMaintenanceNoteSchema = z.object({
    title: z.string(),
    priority: maintenanceNotePrioritySchema,
    description: z.string().max(200),
    note_status: maintenanceNoteStatusSchema
});

export const listMaintenanceNotesSchema = z.object({
    title: z.string().optional(),
    priority: maintenanceNotePrioritySchema.optional(),
    note_satatus: maintenanceNoteStatusSchema.optional(),
    profile_id: z.uuid().optional(),
});

export type CreateMaintenanceNoteInput = z.infer<typeof createMaintenanceNoteSchema>;
export type UpdateMaintenanceNoteInput = z.infer<typeof updateMaintenanceNoteSchema>;
export type ListMaintenanceNoteInput = z.infer<typeof listMaintenanceNotesSchema>;
