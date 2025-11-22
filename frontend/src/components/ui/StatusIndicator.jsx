const StatusIndicator = ({ status, className = '' }) => {
    const colors = {
        active: 'text-green-400',
        inactive: 'text-gray-500'
    };

    return (
        <span className={`text-sm font-medium ${colors[status]} ${className}`}>
            ● {status}
        </span>
    );
};

export default StatusIndicator;