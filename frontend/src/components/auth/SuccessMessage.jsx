import { CheckCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
const SuccessMessage = ({ title, message, actionText, onAction }) => {
    return (
        <div className="text-center space-y-6">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400">{message}</p>
            </div>

            {actionText && onAction && (
                <Button onClick={onAction} className="w-full">
                    {actionText}
                </Button>
            )}
        </div>
    );
}

export default SuccessMessage;