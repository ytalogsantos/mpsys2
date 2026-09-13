export interface CreateUserResponse {
    id: string,
    email: string,
    created_at: string,
}

export interface GetUserResponse {
    id: string,
    email: string,
    role: string,
    active: boolean,
    created_at: Date,
}
