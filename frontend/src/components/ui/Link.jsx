const Link = ({children, href, className = ""}) => {
  return (
    <a 
        href={href}
        className={`text-blue-500 hover:underline transition-colors ${className}`}
    >
        {children}
    </a>
  );
}

export default Link