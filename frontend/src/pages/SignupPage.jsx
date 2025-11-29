import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";

import AnimetedBackground from "../layouts/AnimatedBackground.jsx"
import StepIndicator from "../components/auth/StepIndicator.jsx"
import EmailStep from "../components/auth/EmailStep.jsx"
import OTPStep from "../components/auth/OTPStep.jsx"
import AccountDetailsStep from "../components/auth/AccountDetailsStep.jsx"
import { clearMessages } from "../features/auth/authSlice.js";
import { registerUser, verifyOtp, validateCredentials } from "../features/auth/authThunks.js";

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

export default function SignupPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        name: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userId, user, loading, error } = useSelector((state) => state.auth);

    const steps = [
        { label: 'Enter your email address' },
        { label: 'Verify OTP' },
        { label: 'Complete your account' }
    ];

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
            
            return () => clearTimeout(timeout);
        }
    }, [error, dispatch]);

    // Step 1: Register with email
    const handleEmailSubmit = async (email) => {
        const result = await dispatch(registerUser(email));

        if (registerUser.fulfilled.match(result)) {
            setFormData({ ...formData, email });
            nextStep();
        }

    }

    // Step 2: Verify OTP
    const handleOtpSubmit = async (otp) => {
        const tempUserId = localStorage.getItem("tempUserId") || userId;

        // Validate userId exists
        if (!tempUserId) {
            console.error("❌ No userId found!");
            dispatch(clearMessages());
            // Optionally set an error message or go back to step 1
            return;
        }

        const result = await dispatch(verifyOtp({ userId: tempUserId, otp }));

        if (verifyOtp.fulfilled.match(result)) {
            setFormData({ ...formData, otp });
            nextStep();
        }
    }

    const handleAccountDetailsSubmit = async ({ name, password }) => {
        const tempUserId = localStorage.getItem("tempUserId") || userId;

        await dispatch(validateCredentials({
            userId: tempUserId,
            name,
            password
        }));
        // Redirect is handled by useEffect above
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <AnimetedBackground>
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Create an account</h1>
                <p className="text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
                </p>
            </div>

            <StepIndicator currentStep={currentStep} steps={steps} />

            {error && (
                <div className="mt-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <div className="mt-8 max-w-2xl mx-auto">
                <Card>
                    {currentStep === 1 && (
                        <EmailStep
                            onNext={handleEmailSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}
                    {currentStep === 2 && (
                        <OTPStep
                            onNext={handleOtpSubmit}
                            onBack={prevStep}
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}
                    {currentStep === 3 && (
                        <AccountDetailsStep
                            onSubmit={handleAccountDetailsSubmit}
                            onBack={prevStep}
                            formData={formData}
                            setFormData={setFormData}
                            loading={loading}
                        />
                    )}
                </Card>
            </div>
        </AnimetedBackground>
    );
}