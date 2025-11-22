import RoleFilter from "./RoleFilter.jsx";
import UsersTable from "./UsersTable.jsx";

const UsersSection = ({ users, selectedRole, onRoleChange }) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">All Users</h2>
                <RoleFilter
                    selectedRole={selectedRole}
                    onRoleChange={onRoleChange}
                />
            </div>
            <UsersTable users={users} selectedRole={selectedRole} />
        </div>
    );
};

export default UsersSection;