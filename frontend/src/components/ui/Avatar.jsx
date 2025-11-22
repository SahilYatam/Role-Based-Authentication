const Avatar = ({ name, size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    return (
        <div className={`rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold ${sizes[size]} ${className}`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

export default Avatar;