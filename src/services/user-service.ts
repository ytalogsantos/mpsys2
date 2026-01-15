import type { UserRepository } from "repositories/user-repository.js";
import type { UserServiceInterface } from "./interfaces/user-service-interface.js";
import type { Data } from "repositories/interfaces/crud.js";

export class UserService implements UserServiceInterface{
    constructor(private readonly repository: UserRepository) {}

    public async create(user: Data) {
        if (!user) {
            throw new Error("User data is missing.");
        }
        try {
            return await this.repository.create(user);
        } catch(e: unknown) {
            console.error(e);
            throw new Error("Something went wrong :/");
        }
    }

    public async findUnique(id: string) {
        if (!id) {
            throw new Error("Missing identifier.");
        }
        try {
            this.repository.
        }
    }

}