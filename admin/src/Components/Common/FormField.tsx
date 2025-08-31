import React from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldError } from 'react-hook-form';
import './FormField.scss';

interface FormFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: FieldError;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  className?: string;
  autoComplete?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  control,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  options = [],
  min,
  max,
  step,
  rows = 3,
  className = '',
  autoComplete
}) => {
  const getInputClassName = () => {
    const baseClass = 'form-input';
    const errorClass = error ? 'form-input--error' : '';
    const readonlyClass = readOnly ? 'form-input--readonly' : '';
    return `${baseClass} ${errorClass} ${readonlyClass} ${className}`.trim();
  };

  const renderField = (field: any) => {
    const commonProps = {
      ...field,
      placeholder,
      disabled,
      readOnly,
      autoComplete,
      className: getInputClassName()
    };

    switch (type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${getInputClassName()} form-textarea`}
          />
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            min={min}
            max={max}
            step={step}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => renderField(field)}
      />
      
      {error && (
        <span className="error-text">{error.message}</span>
      )}
    </div>
  );
};

export default FormField;
