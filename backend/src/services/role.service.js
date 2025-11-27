import { roleRepo } from "../repositories/role.repository.js";
import { userRepo } from "../repositories/user.repository.js";
import { logger, ApiError } from "../utils/index.js";


const ROLE_KEYS = [
    process.env.ROLE_SUPER_ADMIN,
    process.env.ROLE_ADMIN,
    process.env.ROLE_EDITOR,
    process.env.ROLE_MEMBER,
];


export const roleService = {
    // creating missing roles at startup
    async seedRoleIfMissing () {
        const defaultRoles = [
            { 
                key: process.env.ROLE_SUPER_ADMIN, 
                name: "Super Admin",
                permissions: {
                    adminPanelAccess: true,
                    canApproveRoles: true,
                    task: {
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                        markComplete: true
                    }
                }
            },

            { 
                key: process.env.ROLE_ADMIN, 
                name: "Admin",
                permissions: {
                    adminPanelAccess: true,
                    canApproveRoles: true,
                    task: {
                        create: true,
                        read: true,
                        update: true,
                        delete: true,
                        markComplete: true
                    }
                }
            },

            { 
                key: process.env.ROLE_EDITOR, 
                name: "Editor",
                permissions: {
                    adminPanelAccess: false,
                    canApproveRoles: false,
                    task: {
                        create: true,
                        read: true,
                        update: true,
                        delete: false,
                        markComplete: true
                    }
                }
            },

            { 
                key: process.env.ROLE_MEMBER, 
                name: "Member",
                permissions: {
                    adminPanelAccess: false,
                    canApproveRoles: false,
                    task: {
                        create: false,
                        read: true,
                        update: false,
                        delete: false,
                        markComplete: true
                    }
                }
            },
        ];

        for (const role of defaultRoles) {
            const existingRole = await roleRepo.findRoleByKey(role.key);
            if(!existingRole){
                await roleRepo.createRole(role);
                logger.info(`Created role with default permissions: ${role.name}`);
            }
        }
        logger.info("✅ Role seeding check completed successfully.");
        
    },

    // assing role to a user 
    async assignRoleToUser (userId, actingUserKey, newRoleKey) {
        // Get the target user's current role
        const targetUser = await userRepo.findByIdWithRole(userId);
        if(!targetUser) throw new ApiError(404, "User not found");

        const newRole = await roleRepo.findRoleByKey(newRoleKey);
        if(!newRole){
            throw new ApiError(404, `Invalid role key: ${newRoleKey}`);
        }

        // Permission hierarchy check
        // 1. Only SuperAdmin can assign Admin role
        if(newRole.key === process.env.ROLE_ADMIN && actingUserKey !== process.env.ROLE_SUPER_ADMIN){
            throw new ApiError(403, "Only SuperAdmin can assign the Admin role")
        }

        // 2. Only SuperAdmin can modify other Admin's role
        if(targetUser.role.key === ROLE_KEYS.ADMIN && actingUserKey !== ROLE_KEYS.SUPER_ADMIN){
            throw new ApiError(403, "Only SuperAdmin can assign the Admin role");
        }

        // 3. Nobody can assign SuperAdmin role because it's a unique role
        if(newRole.key === ROLE_KEYS.SUPER_ADMIN){
            throw new ApiError(403, "SuperAdmin role cannot be assigned");
        }

        await userRepo.updateUserRole(userId, newRole._id);

        logger.info(`User ${userId} role updated to ${newRole.name} by ${actingUserKey}`);

        return {assignedRole: newRole}
    },
};

export default async function initRoles() {
    await roleService.seedRoleIfMissing();
}
