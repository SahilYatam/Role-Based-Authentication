import EmptyState from "../ui/EmptyState.jsx";
import UserRow from "./UserRow.jsx";
import Card from "../ui/Card.jsx";

import { Users } from 'lucide-react';

const UsersTable = ({ users }) => {
    const filteredUsers = users;  

    const columns = [
        { label: 'User', key: 'user' },
        { label: 'Role', key: 'role' },
        { label: 'Status', key: 'status' },
        { label: 'Last Login', key: 'lastLogin' }
    ];

    return (
        <Card className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            {columns.map(column => (
                                <th key={column.key} className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <EmptyState icon={Users} message="No users found with this role" />
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <UserRow key={user._id} user={user} /> 
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
export default UsersTable;