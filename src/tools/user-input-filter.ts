import { Prisma } from "../../generated/prisma/client.js";

function UserInputFilter(obj: Prisma.usersCreateInput): Prisma.usersCreateInput {
    const { email, password } = obj;

    if (!email && !password) {
        console.error("Missing user input.");
        return { email: "", password: ""};
    }

    if (!isEmailValid(email) || !isPasswordValid(password)) {
        console.error("Invalid user input.");
        return { email: "", password: "" };
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

export { UserInputFilter };