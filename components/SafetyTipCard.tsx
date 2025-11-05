
import React from 'react';

interface SafetyTipCardProps {
  tip: string;
  onRefresh: () => void;
  isLoading: boolean;
}

const LightbulbIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
)

export const SafetyTipCard: React.FC<SafetyTipCardProps> = ({ tip, onRefresh, isLoading }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-brand-light rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-start">
        <LightbulbIcon className="h-8 w-8 text-brand-light mr-4 flex-shrink-0 mt-1" />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-brand-primary dark:text-blue-200">Safety Tip of the Day</h3>
          <p className="mt-1 text-gray-700 dark:text-blue-200/90">{tip}</p>
        </div>
        <button 
            onClick={onRefresh} 
            disabled={isLoading}
            className="ml-4 p-1.5 rounded-full text-brand-secondary hover:bg-blue-100 dark:hover:bg-blue-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light transition-transform duration-300 disabled:opacity-50"
            aria-label="Refresh safety tip"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4l-4 4M4 20l4-4" />
            </svg>
        </button>
      </div>
    </div>
  );
};
