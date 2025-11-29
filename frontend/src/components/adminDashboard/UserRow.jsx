import Badge from "../ui/Badge.jsx";
import Avatar from "../ui/Avatar.jsx";
import StatusIndicator from "../ui/StatusIndicator.jsx";

const UserRow = ({ user }) => {
    const getRoleBadgeVariant = (roleKey) => { 
        const variants = { 
            ADMIN: 'admin',
            SUPER_ADMIN: 'admin', 
            EDITOR: 'editor', 
            MEMBER: 'member' 
        };
        return variants[roleKey] || 'default';
    };

    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-all">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <Avatar name={user.name} />
                    <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <Badge variant={getRoleBadgeVariant(user.role?.key)}>
                    {user.role?.name} 
                </Badge>
            </td>
            <td className="px-6 py-4">
                <StatusIndicator status={user.status} />
            </td>
            <td className="px-6 py-4 text-gray-400 text-sm">
                {user.lastLogin || 'Never'}
            </td>
        </tr>
    );
};

export default UserRow;