import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Input from "../ui/Input.jsx"
import Button from "../ui/Button.jsx"

const LoginForm = ({ onSubmit, loading = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = ({ email, password }) => {
        const newErrors = {};
        if (!email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Email is invalid";
        }
        if (!password?.trim()) {
            newErrors.password = "Password is required";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm({ email, password });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            onSubmit({ email, password });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                error={errors.email}
                required
            />

            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter your password"
                    error={errors.password}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-gray-300 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-300 cursor-pointer">
                    <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 rounded border-gray-600 bg-gray-800/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    Remember me
                </label>
                <Link to="/forget-password" className="text-sm">
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Log In'}
            </Button>
        </form>
    );
}

export default LoginForm