import type { ModelConstraints } from "./interfaces/model-constraints.js";

export abstract class BaseService<ModelDelegate extends ModelConstraints, ModelCreateInput> {
    constructor(private readonly model: ModelDelegate) { }

    public async create(input: ModelCreateInput): Promise<ModelDelegate> {
        try {
            const existingEntity = await this.get(input);

            if (existingEntity) {
                console.error("Entity already exists.");
                return existingEntity;
            }

            return await this.model.create({data: input});
        } catch (e: unknown) {
            console.error(e);
            throw new Error("Something went wrong :/");
        }
    }

    public async get(identifier: ModelCreateInput | string | object): Promise<ModelDelegate | null> {
        if (!identifier) {
            console.error("Invalid identifier.");
            return null;
        }

        try {
            const entity = await this.model.findUnique({
                where: identifier
            });

            if (!entity) {
                console.error("Entity not found.");
                return null;
            }
            return entity;
        } catch (e: unknown) {
            throw new Error(`Internal error: ${e}`);
        }
    }

    public async getAll(): Promise<ModelDelegate[] | null> {
        try {
            const entities = await this.model.findMany();

            if (!entities) {
                console.error("Entity not found.");
                return null;
            }

            return entities;
        } catch (e: unknown) {
            throw new Error(`Internal error: ${e}`);
        }
    }

    public async update(identifier: string, data: ModelCreateInput): Promise<void | null> {
        if (!identifier || !data) {
            console.error("Information missing. Please, inform the identifier and data to proceed.");
            return null;
        }

        try {
            await this.model.update({
                where: {
                    id: identifier,
                },
                data: data
            });
            console.log("Data updated successfully.");
        } catch (e: unknown) {
            throw new Error(`Internal error: ${e}`);
        }
    }

    public async delete(identifier: ModelCreateInput | string): Promise<void | null> {
        if (!identifier) {
            console.error("Identifier missing.");
            return null;
        }

        try {
            const existingEntity = await this.get(identifier);
            if (!existingEntity) {
                console.error("Entity not found.");
                return null;
            }
            await this.model.delete({ id: identifier });
            console.log("Entity deleted successfully.");
        } catch (e: unknown) {
            throw new Error(`Internal error: ${e}`);
        }
    }
}
