const RoleInfoCard = ({ role }) => {
    const getInfoByRole = () => {
        switch (role) {
            case 'member':
                return {
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                    text: 'text-blue-300',
                    message: 'You can view and mark tasks as complete. Request Editor or Admin role for more permissions.'
                };
            case 'editor':
                return {
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/20',
                    text: 'text-orange-300',
                    message: 'You can view, update, and mark tasks as complete. Only admins can create and delete tasks.'
                };
            default:
                return null;
        }
    };

    const info = getInfoByRole();
    if (!info) return null;

    return (
        <div className={`mt-6 p-4 ${info.bg} border ${info.border} rounded-lg`}>
            <p className={`text-sm ${info.text}`}>
                <strong>{role.charAt(0).toUpperCase() + role.slice(1)} Access:</strong> {info.message}
            </p>
        </div>
    );
};
export default RoleInfoCard;