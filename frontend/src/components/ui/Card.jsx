const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${className}`}>
      {children}
    </div>
  );
};

export default Card;