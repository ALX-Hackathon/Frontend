import React from 'react';

const Input = ({ id, label, type = 'text', placeholder, value, onChange, error, disabled = false, className = '', ...props }) => {
  const baseStyle = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed';
  const borderStyle = error ? 'border-error focus:ring-error focus:border-error' : 'border-neutral focus:ring-primary focus:border-primary';

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-darker mb-1">{label}</label>}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseStyle} ${borderStyle}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default Input;