import { useState } from "react"

const ResetPasswordForm = ({ onSubmit, loading = false }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
            onSubmit(password);
        }
    }

    return (
        <div className="space-y-5">
            <Input
                type="password"
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

            <Input
                type="password"
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