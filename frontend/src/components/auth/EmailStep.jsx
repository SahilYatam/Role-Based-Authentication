import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

const EmailStep = ({ onNext, formData, setFormData }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.email) onNext(formData.email);
    };

    return (
        <form className="w-full max-w-md mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-2">Enter your email address</h2>
            <p className="text-gray-400 text-sm mb-6">We'll send you a verification code</p>

            <div className="space-y-5">
                <Input
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                />

                <Button onClick={handleSubmit} className="w-full">
                    Send OTP
                </Button>
            </div>
        </form>
    );
};


export default EmailStep