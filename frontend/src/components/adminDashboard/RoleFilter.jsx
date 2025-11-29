import { Filter } from 'lucide-react';

const RoleFilter = ({ selectedRole, onRoleChange }) => {
    const roles = [
        { value: 'all', label: 'All', color: 'bg-blue-500 hover:bg-blue-600' },
        { value: 'MEMBER', label: 'Member', color: 'bg-cyan-500 hover:bg-cyan-600' },
        { value: 'EDITOR', label: 'Editor', color: 'bg-orange-500 hover:bg-orange-600' },
        { value: 'ADMIN', label: 'Admin', color: 'bg-purple-500 hover:bg-purple-600' }
    ];

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {roles.map(role => (
                <button
                    key={role.value}
                    onClick={() => onRoleChange(role.value)}
                    className={`
                        px-4 py-2 text-sm font-medium text-white rounded-lg
                        transition-all duration-200 whitespace-nowrap
                        ${selectedRole === role.value 
                            ? `${role.color} shadow-lg scale-105` 
                            : 'bg-white/10 hover:bg-white/20'
                        }
                    `}
                >
                    {role.label}
                </button>
            ))}
        </div>
    );
};

export default RoleFilter;