const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) => {
    const base = "rounded-md font-medium focus:outline-none focus:ring-2";

    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer",
        secondary: "bg-gray-100 text-white hover:bg-gray-200 cursor-pointer",
        danger: "bg-red-500 text-white hover:bg-red-600"
    }

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    }

    return (
        <button {...props} className={`${base} ${variants[variant]} ${sizes[size]} ...${className}`}>
            {children}
        </button>
    )
}

export default Button