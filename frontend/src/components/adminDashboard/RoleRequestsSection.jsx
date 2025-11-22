import RoleRequestCard from "./RoleRequestCard.jsx";

const RoleRequestsSection = ({ requests, onApprove, onReject }) => {
    if (requests.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-4">Pending Role Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.map(request => (
                    <RoleRequestCard
                        key={request.id}
                        request={request}
                        onApprove={onApprove}
                        onReject={onReject}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoleRequestsSection;