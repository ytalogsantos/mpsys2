import { UserService } from "@services/user-service";

const service = new UserService();

const result = await service.create({
    email: "lebkuchen@gmail.com",
    password: "forgodnesssake",
});

console.log(result);