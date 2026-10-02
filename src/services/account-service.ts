import type { CreateAccountInput } from "@schemas/account-schema";
import type { ProfileService } from "@services/profile-service";
import type { UserService } from "@services/user-service";

export class AccountService {

    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfileService
    ) { }


    public async create(accountData: CreateAccountInput) {

        const user = await this.userService.create(accountData.user);

        const profileData = {
            user_id: user.id,
            ...accountData.profile
        };

        return await this.profileService.create(profileData);

    }

}
