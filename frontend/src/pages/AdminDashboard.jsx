import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Users, UserCheck, UserCog } from 'lucide-react';
import DashboardHeader from "../components/adminDashboard/DashBoardHeader.jsx";
import StatsSection from "../components/adminDashboard/StatsSection.jsx";
import RoleRequestsSection from "../components/adminDashboard/RoleRequestsSection.jsx";
import UsersSection from "../components/adminDashboard/UsersSection.jsx";
import { Loader } from "../components/ui/Loader.jsx"
import { Alert } from "../components/ui/Alert.jsx";

import { getRoleRequests, approveRole, rejectRole } from "../features/roleRequest/roleRequestThunks.js";
import { loadAllUser, assignRole } from "../features/role/roleThunks.js";
import { clearMessages as clearRoleRequestMessages } from "../features/roleRequest/roleRequestSlice.js";
import { clearMessages as clearRoleMessages } from "../features/role/roleSlice.js";

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const [selectedRole, setSelectedRole] = useState('all');

    // Role request state
    const {
        allRequests = [],
        loading: roleReqLoading,
        error: roleReqError,
        successMsg: roleReqSuccess,
    } = useSelector(state => state.roleRequest)

    // Users / Roles State
    const {
        users = [],
        loading: usersLoading,
        error: usersError,
        successMessage: usersSuccess
    } = useSelector(state => state.role);

    // Fetching inital data
    useEffect(() => {
        dispatch(getRoleRequests());
        dispatch(loadAllUser(selectedRole === "all" ? null : selectedRole));
    }, [dispatch, selectedRole]);

    // Clear messages automatically after showing once
    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(clearRoleRequestMessages());
            dispatch(clearRoleMessages());
        }, 3000);

        return () => clearTimeout(timeout);
    }, [roleReqSuccess, roleReqError, usersSuccess, usersError, dispatch]);

    // Role request handlers
    const handleApproveRequest = (requestId) => {
        dispatch(approveRole(requestId));
    }

    const handleRejectRequest = (requestId) => {
        dispatch(rejectRole(requestId));
    }

    // Role assignment handler
    const handleAssignRole = (userId, newRoleKey) => {
        dispatch(assignRole({ id: userId, newRoleKey }));
    }

    const stats = [
        {
            icon: Users,
            title: 'Total Users',
            value: users?.length || 0,  
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
        },
        {
            icon: UserCheck,
            title: 'Active Users',
            value: users?.filter(u => u.status === 'active')?.length || 0,  
            gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
        },
        {
            icon: UserCog,
            title: 'Pending Requests',
            value: allRequests?.length || 0, 
            gradient: 'bg-gradient-to-br from-orange-500 to-pink-500'
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <DashboardHeader
                title="Admin Dashboard"
                subtitle="Manage users and role requests"
            />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Global Feedback */}
                {roleReqSuccess && <Alert type="success" message={roleReqSuccess} />}
                {roleReqError && <Alert type="error" message={roleReqError} />}
                {usersSuccess && <Alert type="success" message={usersSuccess} />}
                {usersError && <Alert type="error" message={usersError} />}

                {/* Stats */}
                <StatsSection stats={stats} />

                {/* Role Requests Section */}
                {roleReqLoading ? (
                    <Loader text="Loading role requests..." />
                ) : (
                    <RoleRequestsSection
                        requests={allRequests}
                        onApprove={handleApproveRequest}
                        onReject={handleRejectRequest}
                    />
                )}

                {/* Users Section */}
                {usersLoading ? (
                    <Loader text="Loading users..." />
                ) : (
                    <UsersSection
                        users={users}
                        selectedRole={selectedRole}
                        onRoleChange={setSelectedRole}
                        onAssignRole={handleAssignRole}
                    />
                )}
            </main>
        </div>
    );
}