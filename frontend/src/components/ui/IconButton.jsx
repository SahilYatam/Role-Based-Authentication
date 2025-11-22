const IconButton = ({ icon: Icon, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-400 hover:text-white transition-colors ${className}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default IconButton;