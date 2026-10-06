import type { CreateUserInput, ListUsersInput, UpdateUserInput } from "@/schemas/user-schema";
import type { CreateUserResponse, GetUserResponse } from "@interfaces/dtos/user";

export interface UserRepository {

    create(userData: CreateUserInput): Promise<CreateUserResponse>;
    
    list(filters: ListUsersInput): Promise<GetUserResponse[]>;

    find(userId: string): Promise<GetUserResponse | null>;

    update(userId: string, userData: UpdateUserInput): Promise<GetUserResponse>;

    delete(userId: string): Promise<void>;

}
