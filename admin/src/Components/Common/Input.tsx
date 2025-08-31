import React, { forwardRef } from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import './Input.scss';

interface InputProps {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  control?: Control<any>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  showPasswordToggle?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  control,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  min,
  max,
  step,
  autoComplete,
  className = '',
  prefix,
  suffix,
  showPasswordToggle = false,
  onFocus,
  onBlur
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const getInputClassName = () => {
    const baseClass = 'input';
    const errorClass = error ? 'input--error' : '';
    const readonlyClass = readOnly ? 'input--readonly' : '';
    const focusedClass = isFocused ? 'input--focused' : '';
    const prefixClass = prefix ? 'input--with-prefix' : '';
    const suffixClass = suffix ? 'input--with-suffix' : '';
    
    return `${baseClass} ${errorClass} ${readonlyClass} ${focusedClass} ${prefixClass} ${suffixClass} ${className}`.trim();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange?.(newValue);
  };

  const renderInput = (field?: any) => {
    const inputProps = {
      ...field,
      ref,
      type: type === 'password' && showPassword ? 'text' : type,
      placeholder,
      disabled,
      readOnly,
      min,
      max,
      step,
      autoComplete,
      className: getInputClassName(),
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: field?.onChange || handleChange,
      value: field?.value ?? value ?? ''
    };

    return (
      <div className="input-wrapper">
        {prefix && (
          <div className="input-prefix">
            {prefix}
          </div>
        )}
        
        <input {...inputProps} />
        
        {suffix && (
          <div className="input-suffix">
            {suffix}
          </div>
        )}
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
    );
  };

  const inputElement = control ? (
    <Controller
      name={name}
      control={control}
      render={({ field }) => renderInput(field)}
    />
  ) : (
    renderInput()
  );

  return (
    <div className="input-container">
      {label && (
        <label htmlFor={name} className="input-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      {inputElement}
      
      {error && (
        <span className="input-error">{error.message}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
