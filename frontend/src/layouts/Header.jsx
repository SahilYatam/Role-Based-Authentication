import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

const Header = ({ user }) => {
    const userRole = (user?.role?.key || 'MEMBER').toUpperCase();

    const navigate = useNavigate();

    const handleNavigate = () => {
        if(userRole === "SUPER_ADMIN" ||  userRole === "ADMIN"){
            navigate("/dashboard")
        }
    }

    const getRoleBadgeStyle = () => {
        switch(userRole) {
            case 'SUPER_ADMIN':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'ADMIN':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'EDITOR':
                return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'MEMBER':
            default:
                return 'bg-green-500/20 text-green-300 border-green-500/30';
        }
    };

    const getRoleLabel = () => {
        switch(userRole) {
            case 'SUPER_ADMIN':
                return 'Super Admin';
            case 'ADMIN':
                return 'Admin';
            case 'EDITOR':
                return 'Editor';
            case 'MEMBER':
            default:
                return 'Member';
        }
    };

    return (
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Task Manager</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-300">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle()}`}>
                        {getRoleLabel()}
                    </div>
                    {(userRole === "SUPER_ADMIN" || userRole === "ADMIN") && (
                        <Button 
                            onClick={handleNavigate}
                            className="rounded-lg w-28 h-11 cursor-pointer"
                        >
                            Dashboard
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;