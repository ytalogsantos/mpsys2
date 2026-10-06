import type { CreateProfileResponse, GetProfileResponse } from "@interfaces/dtos/profile";
import type { CreateProfileInput, ListProfilesInput, UpdateProfileInput } from "@schemas/profile-schema";

export interface ProfileRepository {

    create(profileData: CreateProfileInput): Promise<CreateProfileResponse>;

    find(profileId: string): Promise<GetProfileResponse | null>;

    list(profileFilters: ListProfilesInput): Promise<GetProfileResponse[]>;

    update(profileId: string, profileData: UpdateProfileInput): Promise<GetProfileResponse>;

    delete(profileId: string): Promise<void>;

}
