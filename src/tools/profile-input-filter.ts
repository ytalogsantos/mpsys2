import { Prisma } from "../../generated/prisma/client.js";

function ProfileInputFilter (obj: Prisma.profilesCreateInput): Prisma.profilesCreateInput {
    const { name, role } = obj;
    const filteredInput: Prisma.profilesCreateInput = {name: "", role: "OPERATOR", users: {}};

    if (!name) {
        filteredInput.name = "Unknown User";
    }

    if (!role) {
        filteredInput.role = "OPERATOR";
    }

    return filteredInput;
}

export { ProfileInputFilter };