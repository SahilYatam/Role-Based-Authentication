const Alert = ({ children, variant = "info", className = "" }) => {
  const variants = {
    success: "bg-green-500/10 border-green-500/50 text-green-400",
    error: "bg-red-500/10 border-red-500/50 text-red-400",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-400",
  };

  return (
    <div
      className={`p-4 rounded-lg border backdrop-blur-sm ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Alert;
