import { useState } from 'react'
import OTPInput from '../ui/OTPInput.jsx';
import Button from '../ui/Button.jsx';

const OTPStep = ({ onNext, onBack, formData, setFormData, loading }) => {
    const [otp, setOtp] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.length === 6) {
            setFormData({ ...formData, otp });
            // Pass the OTP to onNext
            onNext(otp);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
            <p className="text-gray-400 text-sm mb-8">
                Enter the 6-digit code sent to {formData.email}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <OTPInput 
                    value={otp} 
                    onChange={setOtp} 
                    length={6}
                    disabled={loading}
                />
                
                <div className="flex gap-3">
                    <Button 
                        type="button"
                        variant="secondary" 
                        onClick={onBack} 
                        className="flex-1"
                        disabled={loading}
                    >
                        Back
                    </Button>
                    <Button 
                        type="submit"
                        className="flex-1"
                        disabled={loading || otp.length !== 6}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default OTPStep;