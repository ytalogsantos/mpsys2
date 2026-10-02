import type { CreateProfileResponse, GetProfileResponse } from "@/interfaces/dtos/profile";
import type { ProfileRepository } from "@interfaces/repositories/profile-repository";
import type { CreateProfileInput, ListProfilesInput } from "@schemas/profile-schema";

export class ProfileService {

    constructor(private readonly profileRepository: ProfileRepository) { }

    public async create(profileData: CreateProfileInput): Promise<CreateProfileResponse> {
        
        return await this.profileRepository.create(profileData);
        
    }

    public async list(profileFilters: ListProfilesInput): Promise<GetProfileResponse[]> {

        return await this.profileRepository.list(profileFilters);

    }

    public async find(profileId: string): Promise<GetProfileResponse | null> {

        return await this.profileRepository.find(profileId);

    }

    public async delete(profileId: string): Promise<void> {
       
        await this.profileRepository.delete(profileId);
        
    }
}
