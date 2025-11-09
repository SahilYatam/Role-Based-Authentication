const Input = ({
    label,
    type = "text",
    placeholder = "",
    value,
    name = "",
    onChange,
    error = "",
    className = "",
}) => {

    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            {label && <label className="mb-1 font-medium text-gray-700">
                {label}
            </label>}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                name={name}
                onChange={onChange}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:right-2 focus:ring-blue-500 focus:border-blue-500 transition ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <span className="text-red-500 text-sm mt-1">
                {error}
            </span>}
        </div>
    )
}

export default Input