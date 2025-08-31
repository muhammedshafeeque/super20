import React, { useState, useRef, useEffect } from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import { ChevronDown, Search, X } from 'lucide-react';
import './Select.scss';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  control?: Control<any>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  options: Option[];
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onFocus?: () => void;
  onBlur?: () => void;
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  control,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  options = [],
  searchable = false,
  multiple = false,
  clearable = false,
  className = '',
  size = 'medium',
  onFocus,
  onBlur
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Initialize selected values
  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      setSelectedValues(value);
    } else if (!multiple && value) {
      setSelectedValues([String(value)]);
    } else {
      setSelectedValues([]);
    }
  }, [value, multiple]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0) {
            handleOptionSelect(filteredOptions[focusedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedLabels = () => {
    if (multiple) {
      return selectedValues
        .map(val => options.find(opt => opt.value === val)?.label)
        .filter(Boolean)
        .join(', ');
    }
    return options.find(opt => opt.value === value)?.label || '';
  };

  const handleToggle = () => {
    if (disabled || readOnly) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      onFocus?.();
    } else {
      onBlur?.();
    }
  };

  const handleOptionSelect = (option: Option) => {
    if (option.disabled) return;

    if (multiple) {
      const newValues = selectedValues.includes(String(option.value))
        ? selectedValues.filter(v => v !== String(option.value))
        : [...selectedValues, String(option.value)];
      
      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValues([String(option.value)]);
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.(multiple ? [] : '');
  };

  const getSelectClassName = () => {
    const baseClass = 'select';
    const errorClass = error ? 'select--error' : '';
    const readonlyClass = readOnly ? 'select--readonly' : '';
    const openClass = isOpen ? 'select--open' : '';
    const sizeClass = `select--${size}`;
    
    return `${baseClass} ${errorClass} ${readonlyClass} ${openClass} ${sizeClass} ${className}`.trim();
  };

  const renderSelect = (field?: any) => {
    const selectValue = field?.value ?? value;
    const selectOnChange = field?.onChange ?? onChange;

    return (
      <div className={getSelectClassName()} ref={selectRef}>
        <div
          className="select-trigger"
          onClick={handleToggle}
          tabIndex={disabled || readOnly ? -1 : 0}
        >
          <div className="select-value">
            {getSelectedLabels() || (
              <span className="select-placeholder">{placeholder}</span>
            )}
          </div>
          
          <div className="select-actions">
            {clearable && selectedValues.length > 0 && (
              <button
                type="button"
                className="select-clear"
                onClick={handleClear}
                tabIndex={-1}
              >
                <X size={14} />
              </button>
            )}
            
            <ChevronDown 
              size={16} 
              className={`select-arrow ${isOpen ? 'select-arrow--open' : ''}`}
            />
          </div>
        </div>

        {isOpen && (
          <div className="select-dropdown">
            {searchable && (
              <div className="select-search">
                <Search size={14} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="select-search-input"
                />
              </div>
            )}

            <div className="select-options">
              {filteredOptions.length === 0 ? (
                <div className="select-no-options">No options found</div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={`select-option ${
                      selectedValues.includes(String(option.value)) ? 'select-option--selected' : ''
                    } ${
                      option.disabled ? 'select-option--disabled' : ''
                    } ${
                      index === focusedIndex ? 'select-option--focused' : ''
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(String(option.value))}
                        readOnly
                        className="select-checkbox"
                      />
                    )}
                    <span className="select-option-label">{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <input
          type="hidden"
          {...field}
          value={selectValue}
          onChange={(e) => selectOnChange?.(e.target.value)}
        />
      </div>
    );
  };

  const selectElement = control ? (
    <Controller
      name={name}
      control={control}
      render={({ field }) => renderSelect(field)}
    />
  ) : (
    renderSelect()
  );

  return (
    <div className="select-container">
      {label && (
        <label htmlFor={name} className="select-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      
      {selectElement}
      
      {error && (
        <span className="select-error">{error.message}</span>
      )}
    </div>
  );
};

export default Select;
