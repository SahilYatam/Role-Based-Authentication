import { useState } from "react"
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordForm = ({ onSubmit, loading = false }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit({password});
        }
    }

    return (
        <div className="space-y-5">
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    label="New Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    placeholder="Enter new password"
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

            <div className="relative">
                <Input
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                    }}
                    placeholder="Confirm new password"
                    error={errors.confirmPassword}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-gray-300 transition-colors"
                >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <div className="text-sm text-gray-400 space-y-1">
                <p className="font-medium">Password must contain:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li className={password.length >= 8 ? "text-green-400" : ""}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>One uppercase letter</li>
                    <li className={/[a-z]/.test(password) ? 'text-green-400' : ''}>One lowercase letter</li>
                    <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>One number</li>
                </ul>
            </div>

            <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
        </div>
    )
}

export default ResetPasswordForm