import { useEffect, useState } from 'react';
import { Radar } from 'lucide-react';

interface ScanningOverlayProps {
  url: string;
  onComplete: () => void;
  duration?: number;
}

const scanSteps = [
  'Resolving DNS and connecting...',
  'Fetching page resources...',
  'Analyzing performance metrics...',
  'Evaluating SEO structure...',
  'Checking mobile responsiveness...',
  'Auditing accessibility compliance...',
  'Assessing usability and UX patterns...',
  'Reviewing technical quality...',
  'Generating AI recommendations...',
];

export default function ScanningOverlay({
  url,
  onComplete,
  duration = 2000,
}: ScanningOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = duration / scanSteps.length;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, stepInterval);

    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-75" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Radar className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Auditing your website
        </h2>
        <p className="text-sm text-gray-500 mb-8 truncate">{url}</p>

        <div className="space-y-2.5 text-left">
          {scanSteps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 transition-all ${
                i <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  i < currentStep
                    ? 'bg-green-500'
                    : i === currentStep
                      ? 'bg-indigo-500'
                      : 'bg-gray-200'
                }`}
              >
                {i < currentStep && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {i === currentStep && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </div>
              <span
                className={`text-sm ${
                  i <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
