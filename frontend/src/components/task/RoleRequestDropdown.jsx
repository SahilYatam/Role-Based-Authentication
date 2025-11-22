import { useState } from "react";
import { ChevronDown, Edit2, Shield } from "lucide-react";
import Button from "../ui/Button.jsx";

const RoleRequestDropdown = ({ onRequestRole }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleRoleRequest = (roleType) => {
        setShowDropdown(false);
        onRequestRole(roleType);
    };

    return (
        <div className="mb-6 p-4 bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-white font-semibold mb-1">Want more access?</h3>
                    <p className="text-gray-400 text-sm">Request Editor role to update tasks or Admin role to manage everything</p>
                </div>
                <div className="relative">
                    <Button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
                    >
                        Request Role
                        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </Button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-lg shadow-xl overflow-hidden z-10">
                            <Button
                                onClick={() => handleRoleRequest('Editor')}
                                className="w-full px-4 py-3 text-left text-white hover:bg-orange-500/20 transition-all flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4 text-orange-400" />
                                <div>
                                    <p className="font-semibold text-sm">Editor Role</p>
                                    <p className="text-xs text-gray-400">Update & read tasks</p>
                                </div>
                            </Button>
                            <div className="border-t border-white/10"></div>
                            <Button
                                onClick={() => handleRoleRequest('Admin')}
                                className="w-full px-4 py-3 text-left text-white hover:bg-purple-500/20 transition-all flex items-center gap-2"
                            >
                                <Shield className="w-4 h-4 text-purple-400" />
                                <div>
                                    <p className="font-semibold text-sm">Admin Role</p>
                                    <p className="text-xs text-gray-400">Full access to manage tasks</p>
                                </div>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RoleRequestDropdown