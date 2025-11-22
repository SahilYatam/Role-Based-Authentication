import { useRef } from "react";

const OTPInput = ({ length = 6, value, onChange }) => {
    const inputRefs = useRef([]);

    const handleChange = (index, inputValue) => {
        if (inputValue.length > 1) inputValue = inputValue[0];
        if (!/^\d*$/.test(inputValue)) return;

        const newOtp = value.split('');
        newOtp[index] = inputValue;
        onChange(newOtp.join(''));

        if (inputValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-3 justify-center">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-16 text-center text-xl font-semibold bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
                />
            ))}
        </div>
    );
};

export default OTPInput;