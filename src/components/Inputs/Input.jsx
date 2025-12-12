import React, { useState } from 'react'

const Input = ({
  value,
  label,
  placeholder,
  type,
  onChange,
  className,
  required,
}) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={className}
        required={required}
      />
    </div>
  );
};

export default Input
