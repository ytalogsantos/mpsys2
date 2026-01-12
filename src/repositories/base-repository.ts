import type { Data } from "../repositories/interfaces/crud.js";

interface modelConstraints {
    create: Function,
    findUnique: Function;
    findMany: Function
    update: Function,
    delete: Function 
}

export abstract class BaseRepository<T extends modelConstraints>{

    constructor(protected readonly model: T) {}

    public async create(data: Data): Promise<typeof this.model> {
        try {
            return await this.model.create(data);
        } catch (e: unknown) {
            console.error(e);
            throw new Error("Something went wrong :/");
        }
    }
}