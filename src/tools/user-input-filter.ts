import { Prisma } from "../../generated/prisma/client.js";

function UserInputFilter(obj: Prisma.usersCreateInput): Prisma.usersCreateInput | boolean {
    const { email, password } = obj;

    if (!email || !password) {
        console.error("Missing user input.");
        return false;
    }

    if (!isEmailValid(email) || !isPasswordValid(password)) {
        console.error("Invalid user input.");
        return false;
    }

    return { email, password };
}

function isEmailValid(email: string): boolean {
    const re = /^[A-Za-z\d._%+-]+@[A-Za-z\d.-]+\.[a-z]{2,}$/;
    return re.test(email);
}

function isPasswordValid(password: string): boolean {
    const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    return re.test(password);
}

export { UserInputFilter, isEmailValid, isPasswordValid };