import type { CreateUserInput, CreateUserResponse, GetUserResponse, UpdateUserInput } from "@interfaces/dtos/user.js";

export interface UserRepository {

    create(userData: CreateUserInput): Promise<CreateUserResponse>;
    
    get(): Promise<GetUserResponse[]>;

    find(userId: string): Promise<GetUserResponse | null>;

    findByEmail(userEmail: string): Promise<GetUserResponse | null>;

    update(userId: string, userData: UpdateUserInput): Promise<void>;

    delete(userId: string): Promise<void>;

}
