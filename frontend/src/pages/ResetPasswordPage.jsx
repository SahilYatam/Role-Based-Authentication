import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

import AnimatedBackground from "../layouts/AnimatedBackground.jsx";
import Card from "../components/ui/Card.jsx";
import ResetPasswordForm from "../components/auth/ResetPasswordForm.jsx";
import SuccessMessage from "../components/auth/SuccessMessage.jsx";

import { resetPassword } from "../features/auth/authThunks.js";
import { clearMessages } from "../features/auth/authSlice.js";

const ResetPasswordPage = () => {
    const [resetSuccess, setResetSuccess] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token} = useParams(); // Extracting token from URL

    const {loading, error, successMessage} = useSelector((state) => state.auth);

    const handleSubmit = ({password}) => {
        dispatch(resetPassword({token, password}));
    };

    useEffect(() => {
        if(successMessage){
            setResetSuccess(true);
        }
    }, [successMessage]);

    useEffect(() => {
        if(error){
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, error])

    const handleBackToLogin = () => {
        setResetSuccess(false);
        dispatch(clearMessages());
        navigate("/login");
    };

    return (
        <AnimatedBackground>
            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
                <div className="w-full max-w-md px-6">
                    <Card>
                        {!resetSuccess ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-white mb-2">Set new password</h1>
                                    <p className="text-gray-400 text-sm">
                                        Your new password must be different from previously used passwords.
                                    </p>
                                </div>

                                <ResetPasswordForm onSubmit={handleSubmit} loading={loading} />
                            </>
                        ) : (
                            <SuccessMessage
                                title="Password reset"
                                message="Your password has been successfully reset. Click below to log in."
                                actionText="Continue to log in"
                                onAction={handleBackToLogin}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </AnimatedBackground>
    )
}

export default ResetPasswordPage