export interface Data {
    email: string,
    password: string
}

export interface ReturnData {
    email: string,
    password: string,
    createdAt: string
}

export interface CrudOperations {
    create(data: Data): ReturnData;
    read(data: string): ReturnData;
    update(id: string, data: Data): boolean
    delete(id: string): boolean
}