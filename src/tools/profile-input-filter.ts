import { Prisma } from "../../generated/prisma/client.js";

function ProfileInputFilter (obj: Prisma.profilesCreateInput): Prisma.profilesCreateInput {
    const { name, role } = obj;
    const filteredInput: Prisma.profilesCreateInput = {name: "", role: "OPERATOR", users: {}};

    filteredInput.name = name || "Unknown";
    filteredInput.role = role || "OPERATOR";

    return filteredInput;
}

export { ProfileInputFilter };