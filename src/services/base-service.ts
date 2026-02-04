interface ModelConstraints {
    create: Function
}
 
export abstract class BaseService<ModelDelegate extends ModelConstraints, CreateInput> {
    constructor(private readonly model: ModelDelegate) {}

    public async create(data: CreateInput): Promise<ModelDelegate> {
        try {
            console.log(this.model);
            return await this.model.create({ data });
        } catch (e: unknown) {
            console.error(e);
            throw new Error("Something went wrong :/");
        }
    }
}
