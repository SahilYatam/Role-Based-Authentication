import { Check } from "lucide-react";

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-px bg-gray-600 -z-10">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 ${
                  isCompleted 
                    ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' 
                    : isCurrent 
                    ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' 
                    : 'bg-transparent border-gray-600 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : stepNumber}
              </div>
              <p className={`mt-3 text-xs font-medium transition-colors ${
                isCurrent || isCompleted ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default StepIndicator