// src/components/ui/Alert.jsx
import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa'; // Using react-icons

const Alert = ({ type = 'info', title, message, className = '' }) => {
  const variants = {
    success: {
      bg: 'bg-green-100 border-green-400',
      text: 'text-green-700',
      icon: <FaCheckCircle className="h-5 w-5 text-green-500" />,
    },
    warning: {
      bg: 'bg-yellow-100 border-yellow-400',
      text: 'text-yellow-700',
      icon: <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />,
    },
    error: {
      bg: 'bg-red-100 border-red-400',
      text: 'text-red-700',
      icon: <FaTimesCircle className="h-5 w-5 text-red-500" />,
    },
    info: {
      bg: 'bg-blue-100 border-blue-400',
      text: 'text-blue-700',
      icon: <FaInfoCircle className="h-5 w-5 text-blue-500" />,
    },
  };

  const selectedVariant = variants[type] || variants.info;

  return (
    <div className={`border-l-4 p-4 ${selectedVariant.bg} ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">{selectedVariant.icon}</div>
        <div className={`ml-3 ${selectedVariant.text}`}>
          {title && <p className="font-bold">{title}</p>}
          {message && <p className="text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Alert;