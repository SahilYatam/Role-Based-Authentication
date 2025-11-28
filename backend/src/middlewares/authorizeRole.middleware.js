import { userRepo } from "../repositories/user.repository.js"
import { ApiError } from "../utils/index.js"

export const authorizeRole = (...allowedKeys) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?._id;
            if(!userId) throw new ApiError(401, "Unauthorized access");

            const user = await userRepo.findByIdWithRole(userId);

            if(!user || !user.role) throw new ApiError(403, "Access denied");

            const roleKey = user.role.key; // immutable, controlled in DB

            if(!allowedKeys.includes(roleKey)){
                throw new ApiError(403, "Insufficient privileges");
            }

            req.user = user;

            next();
        } catch (err) {
            next(err)
        }
    }
}

export const authorizePermission = (permissionPath) => {
    return async (req, res, next) => {
        const user = await userRepo.findByIdWithRole(req.user._id);
        if(!user?.role?.permissions){
            throw new ApiError(403, "Access denied");
        }

        const hasPermission = permissionPath
            .split(".")
            .reduce((obj, key) => obj?.[key], user.role.permissions);

        
        if(!hasPermission) throw new ApiError(403, "Permission denied");

        next();
    }
}