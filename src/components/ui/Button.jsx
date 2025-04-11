import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled = false, isLoading = false, className = '', ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150';

  const variants = {
    primary: `bg-primary text-white hover:bg-primary-dark focus:ring-primary ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-error text-white hover:bg-red-700 focus:ring-error ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
    outline: `border border-neutral text-neutral-darker hover:bg-neutral-light focus:ring-primary ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `text-primary hover:bg-blue-100 focus:ring-primary ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;