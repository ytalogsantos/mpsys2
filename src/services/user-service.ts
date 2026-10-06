import type { CreateUserResponse, GetUserResponse } from "@interfaces/dtos/user";
import type { UserRepository } from "@interfaces/repositories/user-repository";
import type { CreateUserInput, ListUsersInput, UpdateUserInput } from "@schemas/user-schema";

export class UserService implements UserRepository {

    constructor(private readonly userRepository: UserRepository) { };

    public async create(userData: CreateUserInput): Promise<CreateUserResponse> {

        return this.userRepository.create(userData);

    }

    public async list(userFilters: ListUsersInput): Promise<GetUserResponse[]> {

        return await this.userRepository.list(userFilters);

    }

    public async find(userId: string): Promise<GetUserResponse | null> {

        return await this.userRepository.find(userId);

    }

    public async update(userId: string, userData: UpdateUserInput): Promise<GetUserResponse> {
        
        return await this.userRepository.update(userId, userData);

    }

    public async delete(userId: string): Promise<void> {
        
        return await this.userRepository.delete(userId);
        
    }
}
