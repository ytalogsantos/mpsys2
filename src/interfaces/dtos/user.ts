export interface CreateUserInput {
    email: string,
    password: string
}

export interface CreateUserResponse {
    id: string,
    email: string,
    active: boolean,
    created_at: Date,
}

export interface GetUserResponse {
    id: string,
    email: string,
    active: boolean,
    created_at: Date,
}

export interface GetUserByEmailResponse {
    id: string,
    email: string,
    password: string,
    active: boolean,
    created_at: Date,
}

export interface UpdateUserRequest {
    email?: string,
    password?: string,
}

export interface UpdateUserInput {
    email?: string,
    password?: string,
}
