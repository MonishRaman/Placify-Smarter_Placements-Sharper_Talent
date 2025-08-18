import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  focusColor = 'purple' // Default focus color is purple
}) {
  const [showPassword, setShowPassword] = useState(false);



  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md
            dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200
            transition-all duration-300 outline-none
            focus:border-${focusColor}-500 focus:ring-2 focus:ring-${focusColor}-500 focus-visible:ring-offset-0
          `}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 dark:text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}