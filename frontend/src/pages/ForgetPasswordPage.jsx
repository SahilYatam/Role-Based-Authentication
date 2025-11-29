import { useState, useEffect } from "react";
import AnimatedBackground from "../layouts/AnimatedBackground.jsx";
import Card from "../components/ui/Card.jsx";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm.jsx";
import SuccessMessage from "../components/auth/SuccessMessage.jsx";
import { ArrowLeft, Mail } from "lucide-react";

import { forgetPasswordRequest } from "../features/auth/authThunks.js";
import { clearMessages } from "../features/auth/authSlice.js";
import {useNavigate} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

const ForgetPasswordPage = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading, error, successMessage} = useSelector((state) => state.auth);

    const handleSubmit = (email) => {
        setSentEmail(email);
        dispatch(forgetPasswordRequest(email));
    };

    // React to successful API call
    useEffect(() => {
        if(successMessage){
            setEmailSent(true);
        }
    }, [successMessage])

    useEffect(() => {
        if(error){
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 4000)

            return () => clearTimeout(timer);
        }
    }, [dispatch, error])

    const handleBackToLogin = () => {
        setEmailSent(false);
        setSentEmail("");
        dispatch(clearMessages());
        navigate("/login");
    };

    return (
        <AnimatedBackground showBackButton={!emailSent} onBack={handleBackToLogin}>
            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
                <div className="w-full max-w-md px-6">
                    <Card>
                        {!emailSent ? (
                            <>
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Forgot password?
                                    </h1>
                                    <p className="text-gray-400 text-sm">
                                        No worries, we'll send you reset instructions.
                                    </p>
                                </div>

                                <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} />

                                {/* Back to Login */}
                                <div className="text-center mt-6">
                                    <button
                                        onClick={handleBackToLogin}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to log in
                                    </button>
                                </div>
                            </>
                        ) : (
                            <SuccessMessage
                                title="Check your email"
                                message={`We sent a password reset link to ${sentEmail}`}
                                actionText="Back to log in"
                                onAction={handleBackToLogin}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </AnimatedBackground>
    );
};

export default ForgetPasswordPage;
