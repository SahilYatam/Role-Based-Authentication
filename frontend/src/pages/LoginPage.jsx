import { useEffect } from "react";
import { Link } from "react-router-dom";
import AnimetedBackground from "../layouts/AnimatedBackground.jsx"
import LoginForm from "../components/auth/LoginForm.jsx";
import Card from "../components/ui/Card.jsx";

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { loginUser } from "../features/auth/authThunks.js";
import { clearMessages } from "../features/auth/authSlice.js";


export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get state from Redux
    const { loading, user } = useSelector((state) => state.auth);

    // Redirect if user is logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    useEffect(() => {
        dispatch(clearMessages()); 
    }, [dispatch]);


    const handleLogin = async (formData) => {
        dispatch(loginUser(formData));
    }

    return (
        <AnimetedBackground>
            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
                <div className="w-full max-w-md px-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup">Sign up</Link>
                        </p>
                    </div>

                    {/* Login Card */}
                    <Card>
                        <LoginForm onSubmit={handleLogin} loading={loading} />
                    </Card>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        By continuing, you agree to our{' '}
                        <Link href="#" className="text-xs">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="#" className="text-xs">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </AnimetedBackground>
    );
}