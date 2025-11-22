import { useState } from "react";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

const AccountDetailsStep = ({ onBack, formData, setFormData }) => {
    const [error, setError] = useState('');

    const inputData = [
        {
            label: "Name",
            name: "name",
            type: "text",
            placeholder: "Enter your name"
        },
        {
            label: "Password",
            name: "password",
            type: "password",
            placeholder: "Enter your password"
        },
        {
            label: "Confirm Password",
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm your password"
        }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const { name, password, confirmPassword } = formData;

        if (!name) {
            setError("Name is required");
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        alert("Account created successfully! 🎉");
    }
    return (
        <div className="w-full max-w-md mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8">Complete your account</h2>

            <div className="space-y-4">
                {inputData.map((field) => (
                    <div key={field.name}>
                        <Input
                            label={field.label}
                            type={field.type}
                            value={formData[field.name] || ""}
                            placeholder={field.placeholder}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}


                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={onBack} className="flex-1">
                        Back
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1">
                        Sign up
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailsStep;