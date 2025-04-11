// src/components/ui/Select.jsx
import React from 'react';

const Select = ({ id, label, options, value, onChange, error, disabled = false, required = false, placeholder, className = '', ...props }) => {
  const baseStyle = 'block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed';
  const borderStyle = error ? 'border-error focus:ring-error focus:border-error' : 'border-neutral focus:ring-primary focus:border-primary';

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-darker mb-1">{label}</label>}
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`${baseStyle} ${borderStyle}`}
        {...props}
      >
        {placeholder && <option value="" disabled={required}>{placeholder}</option>}
        {options && options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default Select;