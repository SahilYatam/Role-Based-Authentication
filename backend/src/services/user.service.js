import { userRepo } from "../repositories/user.repository.js";
import { ApiError } from "../utils/index.js";

const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role?._id 
        ? { 
            id: user.role._id, 
            key: user.role.key, 
            name: user.role.name 
          }
        : { key: "MEMBER", name: "Member" },
});
export const userService = {
    async getUser(userId) {
        const user = await userRepo.findById(userId);
        if(!user) throw new ApiError(404, "User not found");
        return toPublicUser(user);
    },

    async getUserByRole(key) {
        const roleKey = key?.toUpperCase()?.trim();
        
        if(!roleKey){
            return await userRepo.findAllUserWithRoles();
        }

        return await userRepo.findUserByRoleKey(roleKey)
    }
}