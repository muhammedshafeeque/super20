import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, X } from 'lucide-react';
import { getQualifications, getQualificationTypes } from '../../../Connection/Core';
import AutoComplete from '../../../Components/AutoComplete/AutoComplete';
import './SearchForm.scss';

interface SearchFormData {
  course: string | any; // Allow both string and object
  courseType: string;
  specialization: string | any; // Allow both string and object
}

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
  onClear: () => void;
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  onClear,
  className = ''
}) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      course: '',
      courseType: '',
      specialization: ''
    }
  });

  const [qualificationTypes, setQualificationTypes] = useState<string[]>([]);
  const [clearTrigger, setClearTrigger] = useState(0);

  // Fetch qualification types for dropdown
  useEffect(() => {
    getQualificationTypes()
      .then((data) => {
        setQualificationTypes(data || []);
      })
      .catch(() => {
        setQualificationTypes([]);
      });
  }, []);

  const onSubmit = (data: SearchFormData) => {
    onSearch(data);
  };

  const handleClear = () => {
    reset();
    setClearTrigger(prev => prev + 1);
    onClear();
  };

  const watchedValues = watch();

  return (
    <div className={`search-form ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="search-form-grid">
          <AutoComplete
            value={watchedValues.course}
            onChange={(value) => {
              if (typeof value === 'string') {
                setValue('course', value);
              } else {
                // If it's an object, set the display value
                setValue('course', value ? value.course : '');
              }
            }}
            placeholder="Search by course..."
            label="Course"
            apiMethod={getQualifications}
            filterField="courseContains"
            readField="course"
            clearTrigger={clearTrigger}
            returnFullObject
          />
          
          <div className="form-group">
            <label className="form-label">Course Type</label>
            <select
              {...register('courseType')}
              className="form-select"
              style={{
                width: '100%',
                height: '36px',
                padding: '8px 28px 8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                backgroundColor: '#fff',
                color: '#374151',
                boxSizing: 'border-box',
                lineHeight: '1.2',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All Types</option>
              {qualificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <AutoComplete
            value={watchedValues.specialization}
            onChange={(value) => {
              if (typeof value === 'string') {
                setValue('specialization', value);
              } else {
                // If it's an object, set the display value
                setValue('specialization', value ? value.specialization : '');
              }
            }}
            placeholder="Search by specialization..."
            label="Specialization"
            apiMethod={getQualifications}
            filterField="specializationContains"
            readField="specialization"
            clearTrigger={clearTrigger}
            returnFullObject
          />
        </div>

        <div className="search-form-actions">
          <button type="submit" className="btn btn--primary">
            <Search size={16} />
            <span>Search</span>
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleClear}
          >
            <X size={16} />
            <span>Clear</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 