import type { CrudOperations, Data, ReturnData } from "@src/repositories/interfaces/crud.js";
export abstract class BaseRepository<T> implements CrudOperations {
    public function create(data: Data): ReturnData {
        
    } 
}