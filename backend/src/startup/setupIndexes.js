import { Role } from "../models/role.model.js";
import {logger} from "../utils/index.js";

export const ensureUniqueSuperAdminIndex = async () => {
    try {
        // find the SuperAdmin role
        const superAdminRole = await Role.findOne({key: process.env.ROLE_SUPER_ADMIN});
        if(!superAdminRole){
            logger.warn("SuperAdmin role not found, skipping unique index creation");
            return;
        }

        logger.info("Unique SuperAdmin index created successfully");
    } catch (err) {
        logger.error("Failed to ensure unique SuperAdmin inex", {
            errorMsg: err.message,
            stack: err.stack
        });
    }
}