import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

const ErrorMessage = ({ message, title = 'Ocurrió un Error' }: ErrorMessageProps) => {
  return (
    <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 my-4" role="alert">
      <p className="font-bold">{title}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
