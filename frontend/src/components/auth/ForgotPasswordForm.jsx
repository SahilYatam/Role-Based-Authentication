import { useState } from "react"
import Input from "../ui/Input.jsx"
import Button from "../ui/Button.jsx"

const ForgotPasswordForm = ({ onSubmit, loading = false }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        setError('');
        if(validateEmail()){
            onSubmit(email);
        }
    }

    return (
        <div className="space-y-5">
            <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e)=> {
                    setEmail(e.target.value);
                    if(error) setError('');
                }}
                placeholder="you@example.com"
                error={error}
                required
            />

            <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={loading}
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </Button>
        </div>
    )
}

export default ForgotPasswordForm