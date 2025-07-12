import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-4',
    md: 'w-12 h-12 border-8',
    lg: 'w-16 h-16 border-8',
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div
        className={`loader ease-linear rounded-full border-t-8 border-gray-200 ${sizeClasses[size]}`}
        style={{ borderTopColor: '#3498db' }} // Using a specific color for the spinning part
      ></div>
      {text && <p className="mt-4 text-lg text-gray-300">{text}</p>}
    </div>
  );
};
// Note: This component uses a 'loader' class which might be defined in globals.css.
// The existing globals.css has a .loader class, but I'll redefine it here for clarity with Tailwind.
// The inline style provides the spinning color. For a pure Tailwind approach, you'd use pseudo-elements
// or animations in tailwind.config.js. This is a simpler approach.

// Let's refine the globals.css loader to be more Tailwind-friendly if needed,
// but for now, this will work with the existing CSS.
// Let's modify the component to use the existing class from globals.css correctly.

const BetterLoadingSpinner = ({ text }: { text?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center my-8">
            <div className="loader"></div>
            {text && <p className="mt-4 text-lg text-gray-300">{text}</p>}
        </div>
    )
}

export default BetterLoadingSpinner;
