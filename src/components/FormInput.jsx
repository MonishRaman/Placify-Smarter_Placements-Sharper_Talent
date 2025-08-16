import { Eye, EyeOff } from 'lucide-react';
import { useState, forwardRef } from 'react';

const FormInput = forwardRef(({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  error,
  className = '', 
  labelClassName = '',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 transition-colors duration-200 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
            placeholder-gray-400 dark:placeholder-gray-500
            bg-white dark:bg-gray-700
            border-gray-300 dark:border-gray-600
            text-gray-900 dark:text-white
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;