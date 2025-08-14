import React from 'react';
import { FaCheck } from 'react-icons/fa6';

type StepperProps = {
  steps: string[];
  currentStep: number;
};

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {stepIdx < currentStep -1 ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-blue-600" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-blue-600 rounded-full hover:bg-blue-900">
                  <FaCheck className="h-5 w-5 text-white" />
                </div>
              </>
            ) : stepIdx === currentStep -1 ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-blue-600 rounded-full">
                  <span className="h-2.5 w-2.5 bg-blue-600 rounded-full" />
                </div>
                <span className="absolute top-10 w-max -left-2 text-xs font-semibold text-blue-600">{step}</span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400">
                   <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
                </div>
                 <span className="absolute top-10 w-max -left-2 text-xs font-medium text-gray-500">{step}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;