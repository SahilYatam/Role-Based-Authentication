import { RoleRequest } from "../models/roleRequest.model.js";

const createRoleRequest = (data) => RoleRequest.create(data);

const findRoleRequestById = (id) => RoleRequest.findById(id)
    .populate("user", "name email role")
    .populate("requestedRole", "name");

const findPendingRequests = () => RoleRequest.find({status: "Pending"})
    .populate("user", "name email role")
    .populate("requestedRole", "name");

const findUserRequests = (userId) => RoleRequest.find({user: userId})
    .populate("requestedRole", "name")
    .sort({createdAt: -1});

const updateRoleRequestStatus = (id, updates) => RoleRequest.findByIdAndUpdate(id, updates, {new: true});

const deletedRoleRequest = (id) => RoleRequest.findByIdAndDelete(id);

export const roleRequestRepo = {
    createRoleRequest,
    findRoleRequestById,
    findPendingRequests,
    findUserRequests,
    updateRoleRequestStatus,
    deletedRoleRequest
}
