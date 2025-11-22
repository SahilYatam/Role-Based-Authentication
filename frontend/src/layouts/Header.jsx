import { Shield, Plus, Check, Clock, Trash2, Edit2, ChevronDown } from 'lucide-react';

const Header = ({ user }) => {
    const getRoleBadgeStyle = () => {
        if (user.role === 'admin') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        if (user.role === 'editor') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    };

    const getRoleLabel = () => {
        if (user.role === 'admin') return 'Admin';
        if (user.role === 'editor') return 'Editor';
        return 'Member';
    };

    return (
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Task Manager</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-300">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle()}`}>
                        {getRoleLabel()}
                    </div>
                </div>
            </div>
        </header>
    );
};


export default Header