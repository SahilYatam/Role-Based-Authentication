const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-white/5 text-gray-300 border-white/10',
        admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        editor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        member: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;