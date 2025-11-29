import Badge from "../ui/Badge.jsx"
import Button from "../ui/Button.jsx"
import { Check, X, Clock } from 'lucide-react';

const RoleRequestCard = ({ request, onApprove, onReject }) => {
    const getRoleBadgeVariant = (role) => {
        const variants = {
            admin: 'admin',
            editor: 'editor',
            member: 'member',
            ADMIN: 'admin',
            EDITOR: 'editor',
            MEMBER: 'member'
        };
        return variants[role?.toLowerCase()] || 'default';
    };

    const roleName = request.requestedRole?.name || request.requestedRole;

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-purple-500/20 transition-all">
            <div className="flex w-full items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <p className="text-white font-semibold">{request.userName || request.user?.name}</p>
                        <Badge variant={getRoleBadgeVariant(roleName)}>
                            {roleName}
                        </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">{request.userEmail || request.user?.email}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Requested {request.requestedAt || new Date(request.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="success"
                        size="sm"
                        icon={Check}
                        onClick={() => onApprove(request.id || request._id)}
                        title="Approve"
                    />
                    <Button
                        variant="danger"
                        size="sm"
                        icon={X}
                        onClick={() => onReject(request.id || request._id)}
                        title="Reject"
                    />
                </div>
            </div>
        </div>
    );
};

export default RoleRequestCard;