import React, { useEffect, useState } from 'react';
import { X, Save, Plus, Trash2, User, Mail, Phone, Calendar, MapPin, GraduationCap } from 'lucide-react';
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
  qualification: string;
  institution: string;
  yearOfPassing: number;
  percentage: number;
}

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  employeeData?: any; // Changed to any to handle both old and new structures
  onSubmit: (employeeData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    dateOfJoining: string;
    userRole: string;
    gender: string;
    educationalQualifications: EducationalQualification[];
  }) => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  employeeData, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    dateOfJoining: '',
    userRole: '',
    gender: ''
  });
  
  const [educationalQualifications, setEducationalQualifications] = useState<EducationalQualification[]>([
    { qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<Array<{_id: string, name: string, code: string, description?: string}>>([]);

  useEffect(() => {
    if (employeeData && mode !== 'create') {
      setFormData({
        name: employeeData.name || employeeData.profile?.name || '',
        email: employeeData.user?.email || employeeData.email || '',
        phone: '',
        address: '',
        dateOfBirth: '',
        dateOfJoining: '',
        userRole: employeeData.userRole || '',
        gender: employeeData.gender || ''
      });
      // TODO: Set educational qualifications from employeeData
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        dateOfJoining: '',
        userRole: '',
        gender: ''
      });
      setEducationalQualifications([
        { qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }
      ]);
    }
  }, [employeeData, mode]);

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

  const handleInputChange = (field: string, value: string) => {
    if (mode === 'view') return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQualificationChange = (index: number, field: keyof EducationalQualification, value: string | number) => {
    if (mode === 'view') return;
    
    setEducationalQualifications(prev => 
      prev.map((qual, i) => 
        i === index ? { ...qual, [field]: value } : qual
      )
    );
  };

  const addQualification = () => {
    if (mode === 'view') return;
    
    setEducationalQualifications(prev => [
      ...prev,
      { qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }
    ]);
  };

  const removeQualification = (index: number) => {
    if (mode === 'view') return;
    
    if (educationalQualifications.length > 1) {
      setEducationalQualifications(prev => prev.filter((_, i) => i !== index));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
        !formData.address.trim() || !formData.dateOfBirth || !formData.dateOfJoining || 
        !formData.gender || !formData.userRole) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate educational qualifications
    const hasValidQualifications = educationalQualifications.every(qual => 
      qual.qualification.trim() && qual.institution.trim() && qual.yearOfPassing > 0 && qual.percentage > 0
    );

    if (!hasValidQualifications) {
      alert('Please fill in all educational qualification fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        dateOfJoining: formData.dateOfJoining,
        userRole: formData.userRole,
        gender: formData.gender,
        educationalQualifications: educationalQualifications
      };
      
      onSubmit(submitData);
      
      if (mode === 'create') {
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          dateOfBirth: '',
          dateOfJoining: '',
          userRole: '',
          gender: ''
        });
        setEducationalQualifications([
          { qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }
        ]);
      }
      onClose();
    } catch (err) {
      setError(`Failed to ${mode} employee. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (mode === 'create') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        dateOfJoining: '',
        userRole: '',
        gender: ''
      });
      setEducationalQualifications([
        { qualification: '', institution: '', yearOfPassing: new Date().getFullYear(), percentage: 0 }
      ]);
    }
    setError(null);
    onClose();
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

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 50; year--) {
      years.push(year);
    }
    return years;
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

        <form onSubmit={handleSubmit} className="modal-form">
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
                <input
                  type="text"
                  id="employeeName"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="employeeEmail" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="employeeEmail"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeePhone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="employeePhone"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="employeeAddress" className="form-label">
                  Address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="employeeAddress"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter address"
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeGender" className="form-label">
                  Gender <span className="required">*</span>
                </label>
                <select
                  id="employeeGender"
                  className={`form-select ${mode === 'view' ? 'form-select--readonly' : ''}`}
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  disabled={loading || mode === 'view'}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="employeeUserRole" className="form-label">
                  User Role <span className="required">*</span>
                </label>
                <select
                  id="employeeUserRole"
                  className={`form-select ${mode === 'view' ? 'form-select--readonly' : ''}`}
                  value={formData.userRole}
                  onChange={(e) => handleInputChange('userRole', e.target.value)}
                  required
                  disabled={loading || mode === 'view'}
                >
                  <option value="">Select user role</option>
                  {userRoles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name} {role.code && `(${role.code})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date of Birth <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="dateOfJoining" className="form-label">
                  Date of Joining <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfJoining"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
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

            <div className="qualifications-container">
              {educationalQualifications.map((qualification, index) => (
                <div key={index} className="qualification-item">
                  <div className="qualification-header">
                    <h4 className="qualification-title">Qualification {index + 1}</h4>
                    {mode !== 'view' && educationalQualifications.length > 1 && (
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
                      <AutoComplete
                        value={qualification.qualification}
                        onChange={(value) => {
                          if (typeof value === 'string') {
                            handleQualificationChange(index, 'qualification', value);
                          } else {
                            handleQualificationChange(index, 'qualification', value?.course || '');
                          }
                        }}
                        placeholder="Search qualification..."
                        apiMethod={getQualifications}
                        filterField="courseContains"
                        readField="course"
                        returnFullObject
                        disabled={loading || mode === 'view'}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Institution <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                        value={qualification.institution}
                        onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                        placeholder="Enter institution name"
                        required
                        disabled={loading || mode === 'view'}
                        readOnly={mode === 'view'}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Year of Passing <span className="required">*</span>
                      </label>
                      <select
                        className={`form-select ${mode === 'view' ? 'form-select--readonly' : ''}`}
                        value={qualification.yearOfPassing}
                        onChange={(e) => handleQualificationChange(index, 'yearOfPassing', parseInt(e.target.value))}
                        required
                        disabled={loading || mode === 'view'}
                      >
                        <option value="">Select year</option>
                        {generateYearOptions().map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Percentage <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                        value={qualification.percentage}
                        onChange={(e) => handleQualificationChange(index, 'percentage', parseFloat(e.target.value) || 0)}
                        placeholder="Enter percentage"
                        required
                        disabled={loading || mode === 'view'}
                        readOnly={mode === 'view'}
                      />
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
            <button type="submit" className="btn btn--primary" disabled={loading}>
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
