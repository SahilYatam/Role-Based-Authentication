import Button from "../ui/Button.jsx";
import { Filter } from 'lucide-react';

const RoleFilter = ({ selectedRole, onRoleChange }) => {
  const roles = [
    { value: 'all', label: 'All', variant: 'primary' },
    { value: 'member', label: 'Member', variant: 'blue' },
    { value: 'editor', label: 'Editor', variant: 'orange' },
    { value: 'admin', label: 'Admin', variant: 'purple' }
  ];

  const getButtonVariant = (role) => {
    return selectedRole === role.value ? role.variant : 'default';
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-4 h-4 text-gray-400" />
      {roles.map(role => (
        <Button
          key={role.value}
          variant={getButtonVariant(role)}
          onClick={() => onRoleChange(role.value)}
        >
          {role.label}
        </Button>
      ))}
    </div>
  );
};

export default RoleFilter