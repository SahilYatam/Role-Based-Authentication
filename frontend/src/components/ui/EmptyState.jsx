const EmptyState = ({ icon: Icon, message }) => {
    return (
        <div className="px-6 py-12 text-center">
            <Icon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">{message}</p>
        </div>
    );
}
export default EmptyState;