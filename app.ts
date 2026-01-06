import { posix } from "node:path";
import { prisma } from "./src/config/db";

async function main() {
    // const newUser = await prisma.users.create({
    //     data: {
    //         email: "johndoe@gmail.com",
    //         password: "imnotverycreative123",
    //     },
    // });

    const user = await prisma.users.findUnique({
        where: {
            email: "johndoe@gmail.com",
        },
    });
    console.log(user);
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