import type { ModelConstraints } from "./interfaces/model-constraints.js";

export abstract class BaseService<ModelDelegate extends ModelConstraints, ModelCreateInput> {
    constructor(private readonly model: ModelDelegate) { }

    public async findById(entityId: string): Promise<ModelDelegate | null> {
        try {
            const entity = await this.model.findUnique({
                where: {
                    id: entityId,
                }
            });

            if (!entity) {
                console.log("Entity not found.");
                return null;
            }
            return entity;
        } catch (e) {            
            throw new Error(`"get" operation couldn't be completed due to: ${e}`);
        }
    }

    public async getAll(): Promise<ModelDelegate[]> {
        try {
            return await this.model.findMany();
        } catch (e: unknown) {
            throw new Error(`"getAll" operation couldn't be completed due to: ${e}`);
        }
    }

    public async update(identifier: string, data: ModelCreateInput): Promise<void> {
        try {
            await this.model.update({
                where: {
                    id: identifier,
                },
                data: data
            });
        } catch (e: unknown) {
            throw new Error(`"update" operation couldn't be completed due to: ${e}`);
        }
    }

    public async delete(identifier: string): Promise<void> {
        try {
            await this.model.delete({
                where: {
                    id: identifier
                }
            });
        } catch (e: unknown) {
            throw new Error(`"delete" operation couldn't be completed due to: ${e}`);
        }
    }
}
