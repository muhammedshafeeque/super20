import React, { useEffect, useState } from 'react';
import { X, Save, Plus, Trash2, User, Mail, Phone, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AutoComplete from '../../../Components/AutoComplete/AutoComplete';
import { getQualifications } from '../../../Connection/Core';
import { getUserRoles } from '../../../Connection/Auth';
import './CreateEmployeeModal.scss';

interface Employee {
  _id: string;
  email: string;
  userType: string;
  profile: {
    _id: string;
    name: string;
    age?: number;
    gender?: string;
    profilePicture?: string;
  };
  __v: number;
}

interface EducationalQualification {
  qualification: string | any; // Can be string or full object
  institution: string;
  yearOfPassing: number;
  percentage: number;
}

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  dateOfJoining: string;
  userRole: string;
  gender: string;
  educationalQualifications: EducationalQualification[];
}

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  employeeData?: any;
  onSubmit: (employeeData: EmployeeFormData) => void;
}

// Validation schema
const employeeSchema = yup.object({
  name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  phone: yup.string().required('Phone number is required').min(10, 'Phone number must be at least 10 digits'),
  address: yup.string().required('Address is required').min(5, 'Address must be at least 5 characters'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  dateOfJoining: yup.string().required('Date of joining is required'),
  userRole: yup.string().required('User role is required'),
  gender: yup.string().required('Gender is required'),
     educationalQualifications: yup.array().of(
     yup.object({
       qualification: yup.mixed().required('Qualification is required'),
       institution: yup.string().required('Institution is required'),
       yearOfPassing: yup.number().required('Year of passing is required').min(1950, 'Invalid year').max(new Date().getFullYear(), 'Year cannot be in the future'),
       percentage: yup.number().required('Percentage is required').min(0, 'Percentage must be at least 0').max(100, 'Percentage cannot exceed 100')
     })
   ).min(1, 'At least one educational qualification is required')
});

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  employeeData, 
  onSubmit 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<Array<{_id: string, name: string, code: string, description?: string}>>([]);

  // Initialize form with React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(employeeSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      dateOfJoining: '',
      userRole: '',
      gender: '',
      educationalQualifications: [
        { qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }
      ]
    }
  });

  // Use field array for educational qualifications
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'educationalQualifications'
  });

  // Initialize form data when employeeData changes
  useEffect(() => {
    if (employeeData && mode !== 'create') {
      // Format dates for input fields (YYYY-MM-DD format)
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Format educational qualifications
      const formatQualifications = () => {
        if (employeeData.educationalQualifications && employeeData.educationalQualifications.length > 0) {
          return employeeData.educationalQualifications.map((qual: any) => ({
            qualification: qual.qualification || '',
            institution: qual.institution || '',
            yearOfPassing: qual.yearOfPassing || new Date().getFullYear(),
            percentage: qual.percentage || 0
          }));
        }
        return [{ qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }];
      };

      reset({
        name: employeeData.name || employeeData.profile?.name || '',
        email: employeeData.user?.email || employeeData.email || '',
        phone: employeeData.phone || employeeData.profile?.phone || '',
        address: employeeData.address || employeeData.profile?.address || '',
        dateOfBirth: formatDateForInput(employeeData.dateOfBirth || employeeData.profile?.dateOfBirth),
        dateOfJoining: formatDateForInput(employeeData.dateOfJoining || employeeData.profile?.dateOfJoining),
        userRole: employeeData.userRole || employeeData.profile?.userRole || '',
        gender: employeeData.gender || employeeData.profile?.gender || '',
        educationalQualifications: formatQualifications()
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        dateOfJoining: '',
        userRole: '',
        gender: '',
        educationalQualifications: [
          { qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }
        ]
      });
    }
  }, [employeeData, mode, reset]);

  // Fetch user roles when component mounts
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const response = await getUserRoles();
        if (response && response.results && Array.isArray(response.results)) {
          setUserRoles(response.results);
        } else if (Array.isArray(response)) {
          setUserRoles(response);
        } else {
          setUserRoles([]);
        }
      } catch (err) {
        console.error('Failed to fetch user roles:', err);
        setUserRoles([]);
      }
    };

    if (isOpen) {
      fetchUserRoles();
    }
  }, [isOpen]);

  // Form submission handler
  const onSubmitForm = async (data: any) => {
    if (mode === 'view') return;
    
    try {
      setLoading(true);
      setError(null);
      
      await onSubmit(data);
      
      // Only close modal and reset form on success
      if (mode === 'create') {
        reset();
      }
      onClose();
    } catch (err) {
      setError(`Failed to ${mode} employee. Please try again.`);
      // Don't close modal on error - let user see the error and try again
    } finally {
      setLoading(false);
    }
  };

  // Add qualification
  const addQualification = () => {
    if (mode === 'view') return;
    append({ qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 });
  };

  // Remove qualification
  const removeQualification = (index: number) => {
    if (mode === 'view') return;
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Close modal
  const handleClose = () => {
    if (mode === 'create') {
      reset();
    }
    setError(null);
    onClose();
  };

  // Generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push(year);
    }
    return years;
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Employee';
      case 'edit': return 'Edit Employee';
      case 'view': return 'View Employee';
      default: return 'Employee';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'create': return 'Create Employee';
      case 'edit': return 'Update Employee';
      case 'view': return 'Close';
      default: return 'Submit';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-container--large">
        <div className="modal-header">
          <h2 className="modal-title">{getModalTitle()}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-section">
            <h3 className="form-section-title">
              <User size={16} />
              Basic Information
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeName" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      id="employeeName"
                      className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.name ? 'form-input--error' : ''}`}
                      placeholder="Enter full name"
                      disabled={loading || mode === 'view'}
                      readOnly={mode === 'view'}
                    />
                  )}
                />
                {errors.name && (
                  <span className="error-text">{errors.name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="employeeEmail" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      id="employeeEmail"
                      className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.email ? 'form-input--error' : ''}`}
                      placeholder="Enter email address"
                      disabled={loading || mode === 'view'}
                      readOnly={mode === 'view'}
                    />
                  )}
                />
                {errors.email && (
                  <span className="error-text">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeePhone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      id="employeePhone"
                      className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.phone ? 'form-input--error' : ''}`}
                      placeholder="Enter phone number"
                      disabled={loading || mode === 'view'}
                      readOnly={mode === 'view'}
                    />
                  )}
                />
                {errors.phone && (
                  <span className="error-text">{errors.phone.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="employeeAddress" className="form-label">
                  Address <span className="required">*</span>
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      id="employeeAddress"
                      className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.address ? 'form-input--error' : ''}`}
                      placeholder="Enter address"
                      disabled={loading || mode === 'view'}
                      readOnly={mode === 'view'}
                    />
                  )}
                />
                {errors.address && (
                  <span className="error-text">{errors.address.message}</span>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeGender" className="form-label">
                  Gender <span className="required">*</span>
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="employeeGender"
                      className={`form-select ${mode === 'view' ? 'form-select--readonly' : ''} ${errors.gender ? 'form-select--error' : ''}`}
                      disabled={loading || mode === 'view'}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                />
                {errors.gender && (
                  <span className="error-text">{errors.gender.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="employeeUserRole" className="form-label">
                  User Role <span className="required">*</span>
                </label>
                <Controller
                  name="userRole"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="employeeUserRole"
                      className={`form-select ${mode === 'view' ? 'form-select--readonly' : ''} ${errors.userRole ? 'form-select--error' : ''}`}
                      disabled={loading || mode === 'view'}
                    >
                      <option value="">Select user role</option>
                      {userRoles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name} {role.code && `(${role.code})`}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.userRole && (
                  <span className="error-text">{errors.userRole.message}</span>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth <span className="required">*</span>
                </label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      id="dateOfBirth"
                      className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.dateOfBirth ? 'form-input--error' : ''}`}
                      disabled={loading || mode === 'view'}
                      readOnly={mode === 'view'}
                    />
                  )}
                />
                {errors.dateOfBirth && (
                  <span className="error-text">{errors.dateOfBirth.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfJoining" className="form-label">
                  Date of Joining <span className="required">*</span>
                </label>
                <Controller
                  name="dateOfJoining"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      id="dateOfJoining"
                      className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.dateOfJoining ? 'form-input--error' : ''}`}
                      disabled={loading || mode === 'view'}
                      readOnly={mode === 'view'}
                    />
                  )}
                />
                {errors.dateOfJoining && (
                  <span className="error-text">{errors.dateOfJoining.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">
                <GraduationCap size={16} />
                Educational Qualifications
              </h3>
              {mode !== 'view' && (
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  onClick={addQualification}
                  disabled={loading}
                >
                  <Plus size={14} />
                  <span>Add Qualification</span>
                </button>
              )}
            </div>

            {errors.educationalQualifications && (
              <div className="error-message">
                {errors.educationalQualifications.message}
              </div>
            )}

            <div className="qualifications-container">
              {fields.map((field, index) => (
                <div key={field.id} className="qualification-item">
                  <div className="qualification-header">
                    <h4 className="qualification-title">Qualification {index + 1}</h4>
                    {mode !== 'view' && fields.length > 1 && (
                      <button
                        type="button"
                        className="btn btn--icon btn--icon--delete btn--small"
                        onClick={() => removeQualification(index)}
                        disabled={loading}
                        title="Remove qualification"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Qualification <span className="required">*</span>
                      </label>
                                             <Controller
                         name={`educationalQualifications.${index}.qualification`}
                         control={control}
                         render={({ field }) => {
                           // Get the display value for the input
                           const displayValue = typeof field.value === 'object' && field.value?.course 
                             ? field.value.course 
                             : typeof field.value === 'string' 
                               ? field.value 
                               : '';
                           
                           return (
                             <AutoComplete
                               value={displayValue}
                               onChange={(value) => {
                                 // Save the entire object, not just the course string
                                 field.onChange(value);
                               }}
                               placeholder="Search qualification..."
                               apiMethod={getQualifications}
                               filterField="courseContains"
                               readField="course"
                               returnFullObject
                               disabled={loading || mode === 'view'}
                               className={errors.educationalQualifications?.[index]?.qualification ? 'form-input--error' : ''}
                             />
                           );
                         }}
                       />
                       {errors.educationalQualifications?.[index]?.qualification && (
                         <span className="error-text">{String(errors.educationalQualifications[index]?.qualification?.message)}</span>
                       )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Institution <span className="required">*</span>
                      </label>
                      <Controller
                        name={`educationalQualifications.${index}.institution`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.educationalQualifications?.[index]?.institution ? 'form-input--error' : ''}`}
                            placeholder="Enter institution name"
                            disabled={loading || mode === 'view'}
                            readOnly={mode === 'view'}
                          />
                        )}
                      />
                      {errors.educationalQualifications?.[index]?.institution && (
                        <span className="error-text">{errors.educationalQualifications[index]?.institution?.message}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Year of Passing <span className="required">*</span>
                      </label>
                      <Controller
                        name={`educationalQualifications.${index}.yearOfPassing`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className={`form-select ${mode === 'view' ? 'form-select--readonly' : ''} ${errors.educationalQualifications?.[index]?.yearOfPassing ? 'form-select--error' : ''}`}
                            disabled={loading || mode === 'view'}
                          >
                            <option value="">Select year</option>
                            {generateYearOptions().map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.educationalQualifications?.[index]?.yearOfPassing && (
                        <span className="error-text">{errors.educationalQualifications[index]?.yearOfPassing?.message}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Percentage <span className="required">*</span>
                      </label>
                      <Controller
                        name={`educationalQualifications.${index}.percentage`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''} ${errors.educationalQualifications?.[index]?.percentage ? 'form-input--error' : ''}`}
                            placeholder="Enter percentage"
                            disabled={loading || mode === 'view'}
                            readOnly={mode === 'view'}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        )}
                      />
                      {errors.educationalQualifications?.[index]?.percentage && (
                        <span className="error-text">{errors.educationalQualifications[index]?.percentage?.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn--secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading || (mode !== 'view' && !isValid)}>
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  <span>{mode === 'create' ? 'Creating...' : mode === 'edit' ? 'Updating...' : 'Loading...'}</span>
                </>
              ) : (
                <>
                  {mode === 'view' ? null : <Save size={16} />}
                  <span>{getSubmitButtonText()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
