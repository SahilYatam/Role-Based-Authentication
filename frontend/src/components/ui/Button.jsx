// const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', ...props }) => {
//   const baseStyles = "py-3 font-semibold rounded-lg transition-all";
  
//   const variants = {
//     primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]",
//     secondary: "bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600/50 text-white border border-gray-600/30",
//     success: "bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]",
//     danger: "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
//   };

//   const sizes = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-3",
//     lg: "px-6 py-4 text-lg"
//   };

//   return (
//     <button
//       onClick={onClick}
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

const Button = ({ children, onClick, variant = 'primary', size = 'md', icon: Icon, className = '', ...props }) => {
  const baseStyles = "font-semibold rounded-lg transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]",
    secondary: "bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600/50 text-white border border-gray-600/30",
    success: "bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
  };

  const sizes = {
    sm: "px-2 py-1.5 text-sm",
    md: "px-4 py-3",
    lg: "px-6 py-4 text-lg"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;