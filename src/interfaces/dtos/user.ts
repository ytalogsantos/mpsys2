export interface CreateUserInput {
    email: string,
    password: string
}

export interface CreateUserRequest {
    email: string,
    password: string
}

export interface UpdateUserRequest {
    email?: string,
    password?: string,
}

export interface UpdateUserInput {
    email?: string,
    password?: string,
}

export interface CreateUserResponse {
    id: string,
    email: string,
    active: boolean,
    created_at: Date
}

export interface LoginUserRequest {
    email: string,
    password: string
}

export interface LoginUserResponse {
    
}