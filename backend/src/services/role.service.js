import { roleRepo } from "../repositories/role.repository.js";
import { userRepo } from "../repositories/user.repository.js";
import { logger, ApiError } from "../utils";


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

    async getAllRoles() {
        const roles = await roleRepo.findAllRoles();
        if(!roles || roles.length === 0){
            logger.warn("No roles found in the database");
            throw new ApiError(404, "No roles found in the system")
        }
        return roles;
    },

    async getRoleByKey (roleKey){
        const role = await roleRepo.findRoleByKey(roleKey);
        if(!role){
            throw new ApiError(404, `Role not found for key: ${roleKey}`);
        }
        return role;
    },

    async getDefaultRoleId() {
        const defaultRole = await roleRepo.findRoleByKey(process.env.ROLE_MEMBER);
        if(!defaultRole){
            throw new ApiError(500, "Default role 'Member' not found");
        }
        return defaultRole._id;
    },

    // assing role to a user 
    async assignRoleToUser (userId, actingUserKey, newRoleKey) {
        const newRole = await roleRepo.findRoleByKey(newRoleKey);
        if(!newRole){
            throw new ApiError(404, `Invalid role key: ${newRoleKey}`);
        }

        // Permission hierarchy check
        if(newRole.key === process.env.ROLE_ADMIN && actingUserKey !== process.env.ROLE_SUPER_ADMIN){
            throw new ApiError(403, "Only SuperAdmin can assign the Admin role")
        }

        await userRepo.assignRoleToUser(userId, newRole._id);

        logger.info(`User ${userId} role updated to ${newRole.name} by ${actingUserKey}`);

        return {assignedRole: newRole}
    },

    async updateRolePermissions (roleId, updates){
        const role = await roleRepo.findRoleById(roleId);
        if(!role){
            throw new ApiError(404, "Role not found");
        }
        const updatedRole = await roleRepo.updateRole(roleId, updates);
        logger.info(`Permissions updated for role: ${role.name}`);
        return {roleName: role.name, updatedRole};
    },

    // Delete a role (only SuperAdmin)
    async deleteRole (roleId, actingUserKey){
        const role = await roleRepo.findRoleById(roleId);
        if(!role) throw new ApiError(404, "Role not found");

        if(ROLE_KEYS.includes(role.key)){
            throw new ApiError(403, "System roles cannot be deleted");
        }

        if(actingUserKey !== process.env.ROLE_SUPER_ADMIN){
            throw new ApiError(403, "Only SuperAdmin can delete roles")
        }

        await roleRepo.deleteRole(roleId);
        logger.info(`System action: Role '${role.name}' deleted by user with role ${actingUserKey}`);

        return {message: `Role '${role.name}' has been successfully deleted`};
    }
};

export default async function initRoles() {
    await roleService.seedRoleIfMissing();
}
