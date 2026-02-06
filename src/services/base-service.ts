import type { ModelConstraints } from "./interfaces/model-constraints.js";

export abstract class BaseService<ModelDelegate extends ModelConstraints, ModelCreateInput> {
    constructor(private readonly model: ModelDelegate) {}

    public async create(data: ModelCreateInput): Promise<ModelDelegate> {
        try {
            const existingEntity = await this.find({ data });
            
            if (existingEntity) {
                console.error("Entity already exists.");
                return existingEntity;
            }

            return await this.model.create({ data });
        } catch (e: unknown) {
            console.error(e);
            throw new Error("Something went wrong :/");
        }
    }

    public async find(identifier: object): Promise<ModelDelegate | null> {
        try {
            if (!identifier) {
                console.error("Invalid identifier");
                return null;
            }
            const entity = this.model.findUnique({
                where: identifier
            });

            if (!entity) {
                console.error("Not such an entity found.");
                return null;
            }
            return entity;
        } catch (e: unknown) {
            throw new Error("Internal error...");
        }
    }
}
