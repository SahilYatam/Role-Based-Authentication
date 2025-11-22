const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "py-3 font-semibold rounded-lg transition-all";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]",
    secondary: "bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600/50 text-white border border-gray-600/30"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;