interface modelConstraints {
    create: Function
}

interface Data {
    email: string,
    password: string,
}

export abstract class BaseService<T extends modelConstraints> {
    constructor(private readonly model: T) {}

    public async create(data: Data): Promise<T> {
        try {
            return await this.model.create(data);
        } catch (e: unknown) {
            console.error(e);
            throw new Error("Something went wrong :/");
        }
    }
}
