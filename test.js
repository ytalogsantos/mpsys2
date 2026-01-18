"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_service_1 = require("@services/user-service");
var service = new user_service_1.UserService();
var result = await service.create({
    email: "lebkuchen@gmail.com",
    password: "forgodnesssake",
});
console.log(result);
