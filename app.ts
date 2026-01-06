import { posix } from "node:path";
import { prisma } from "./src/config/db";

async function main() {
    const newUser = await prisma.users.create({
        data: {
            email: "johndoe@gmail.com",
            password: "imnotverycreative123",
        },
    });
}

main()
.then(async() => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})