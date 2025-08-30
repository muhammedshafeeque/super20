import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import './AutoComplete.scss';

interface AutoCompleteProps {
  value: string;
  onChange: (value: string | any) => void; // Allow both string and object
  onSelect?: (option: any) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  apiMethod: (params: any) => Promise<any>;
  filterField?: string;
  readField?: string;
  params?: any;
  clearTrigger?: any;
  minSearchLength?: number;
  maxResults?: number;
  returnFullObject?: boolean; // New prop to control return behavior
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search...',
  label,
  disabled = false,
  required = false,
  error,
  className = '',
  apiMethod,
  filterField = 'nameContains',
  readField = 'name',
  params = {},
  clearTrigger,
  minSearchLength = 2,
  maxResults = 10,
  returnFullObject = false // Default to false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

    // Debounced fetch function
  const fetchOptions = useCallback(async (searchValue: string) => {
    if (!searchValue || searchValue.length < minSearchLength) {
      setOptions([]);
      return;
    }
    
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const searchParams = {
        [filterField]: searchValue,
        ...params,
        skip: 0,
        limit: maxResults,
      };
      
      const response = await apiMethod(searchParams);
      console.log('API Response:', response);
      const data = response?.results ? response.results : response.data;
      console.log('Processed data:', data);

      if (Array.isArray(data)) {
        setOptions(data);
      } else {
        setErrorMessage("Invalid data format received");
        setOptions([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setErrorMessage("Error fetching data");
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [apiMethod, filterField, params, selectedOption, minSearchLength, maxResults]);

  // Handle input change with debounce
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setSelectedOption(null);
    
    // Always open dropdown when typing
    setDropdownOpen(true);
    
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      if (newValue.trim() && newValue.length >= minSearchLength) {
        fetchOptions(newValue);
      } else {
        setOptions([]);
      }
    }, 300); // 300ms debounce
    
    setDebounceTimer(timer);
  };

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    const displayValue = option[readField];
    setInputValue(displayValue);
    
    // If returnFullObject is true, pass the entire object to onChange
    if (returnFullObject) {
      onChange(option); // Pass the entire object
    } else {
      onChange(displayValue); // Pass just the display value
    }
    
    if (onSelect) {
      onSelect(option);
    }
    setOptions([]);
    setDropdownOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedOption(null);
    
    // If returnFullObject is true, pass null to onChange
    if (returnFullObject) {
      onChange(null);
    } else {
      onChange('');
    }
    
    if (onSelect) {
      onSelect(null);
    }
    setOptions([]);
    setDropdownOpen(false);
  };

  const handleFocus = () => {
    if (!disabled) {
      setDropdownOpen(true);
      // If there's a value and no options, try to fetch options
      if (inputValue.trim() && inputValue.length >= minSearchLength && options.length === 0) {
        fetchOptions(inputValue);
      }
    }
  };

  const handleBlur = () => {
    // Delay closing to allow option selection
    setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  // Clear effect
  useEffect(() => {
    if (clearTrigger !== undefined) {
      setInputValue('');
      setSelectedOption(null);
      setOptions([]);
      setDropdownOpen(false);
    }
  }, [clearTrigger]);

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasError = error || errorMessage;

  return (
    <div className={`autocomplete-wrapper ${className}`} ref={containerRef}>
      {label && (
        <label className="autocomplete-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className={`autocomplete-input-container ${hasError ? 'autocomplete-input-container--error' : ''}`}>
        <div className="autocomplete-input-wrapper">
          <Search className="autocomplete-search-icon" size={16} />
          <input
            type="text"
            className="autocomplete-input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            style={{
              width: '100%',
              height: '36px',
              padding: '8px 28px 8px 32px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              transition: 'all 0.2s ease',
              backgroundColor: '#fff',
              color: '#374151',
              boxSizing: 'border-box',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          />
          {inputValue && !disabled && (
            <button
              type="button"
              className="autocomplete-clear-btn"
              onClick={handleClear}
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            className={`autocomplete-dropdown-btn ${dropdownOpen ? 'autocomplete-dropdown-btn--open' : ''}`}
            onClick={() => {
              const newState = !dropdownOpen;
              setDropdownOpen(newState);
              // If opening and there's a value, try to fetch options
              if (newState && inputValue.trim() && inputValue.length >= minSearchLength && options.length === 0) {
                fetchOptions(inputValue);
              }
            }}
            disabled={disabled}
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {hasError && (
        <div className="autocomplete-error">
          {error || errorMessage}
        </div>
      )}

      {dropdownOpen && (
        <div className="autocomplete-dropdown" style={{display: 'block'}}>
          {loading ? (
            <div className="autocomplete-loading">
              <div className="loading-spinner-small"></div>
              <span>Loading...</span>
            </div>
          ) : options.length > 0 ? (
            <ul className="autocomplete-options">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="autocomplete-option"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option[readField]}
                </li>
              ))}
            </ul>
          ) : inputValue.length >= minSearchLength ? (
            <div className="autocomplete-no-results">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AutoComplete; 