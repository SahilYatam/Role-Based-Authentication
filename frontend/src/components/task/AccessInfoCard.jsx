

const AccessInfoCard = ({ role }) => {
    if (role === "member") {
        return (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300">
                    <strong>Member Access:</strong> You can view and mark tasks as complete. Request Editor or Admin role for more permissions.
                </p>
            </div>
        );
    }

    if (role === "editor") {
        return (
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-sm text-orange-300">
                    <strong>Editor Access:</strong> You can view, update, and mark tasks as complete. Only admins can create and delete tasks.
                </p>
            </div>
        );
    }

    return null;
}

export default AccessInfoCard