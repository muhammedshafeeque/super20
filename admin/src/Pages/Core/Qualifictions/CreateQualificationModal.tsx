import React, { useEffect, useState } from 'react';
import { X, Save, GraduationCap } from 'lucide-react';
import './CreateQualificationModal.scss';
import { createQualification, updateQualification, getQualificationTypes } from '../../../Connection/Core';

interface Qualification {
  _id: string;
  qualificationType: string;
  course: string;
  specialization: string;
  __v: number;
}

interface CreateQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  qualificationData?: Qualification;
  onSubmit: (qualificationData: {
    qualificationType: string;
    course: string;
    specialization: string;
  }) => void;
}

const CreateQualificationModal: React.FC<CreateQualificationModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  qualificationData, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    qualificationType: '',
    course: '',
    specialization: ''
  });
  const [qualificationTypes, setQualificationTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const typesResponse = await getQualificationTypes();
        setQualificationTypes(typesResponse || []);
      } catch (err) {
        setError('Failed to fetch qualification types');
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (qualificationData && mode !== 'create') {
      setFormData({
        qualificationType: qualificationData.qualificationType || '',
        course: qualificationData.course || '',
        specialization: qualificationData.specialization || ''
      });
    } else {
      setFormData({ qualificationType: '', course: '', specialization: '' });
    }
  }, [qualificationData, mode]);

  const handleInputChange = (field: string, value: string) => {
    if (mode === 'view') return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    if (!formData.qualificationType.trim() || !formData.course.trim() || !formData.specialization.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        qualificationType: formData.qualificationType,
        course: formData.course,
        specialization: formData.specialization
      };
      
      if (mode === 'create') {
        await createQualification(submitData);
      } else if (mode === 'edit' && qualificationData) {
        await updateQualification(qualificationData._id, submitData);
      }
      
      onSubmit(submitData);
      
      if (mode === 'create') {
        setFormData({ qualificationType: '', course: '', specialization: '' });
      }
      onClose();
    } catch (err) {
      setError(`Failed to ${mode} qualification. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (mode === 'create') {
      setFormData({ qualificationType: '', course: '', specialization: '' });
    }
    setError(null);
    onClose();
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Qualification';
      case 'edit': return 'Edit Qualification';
      case 'view': return 'View Qualification';
      default: return 'Qualification';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'create': return 'Create Qualification';
      case 'edit': return 'Update Qualification';
      case 'view': return 'Close';
      default: return 'Submit';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
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
            <h3 className="form-section-title">Qualification Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="qualificationType" className="form-label">
                  Qualification Type <span className="required">*</span>
                </label>
                <select
                  id="qualificationType"
                  className={`form-select ${mode === 'view' ? 'form-select--readonly' : ''}`}
                  value={formData.qualificationType}
                  onChange={(e) => handleInputChange('qualificationType', e.target.value)}
                  required
                  disabled={loading || mode === 'view'}
                >
                  <option value="">Select qualification type</option>
                  {qualificationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="course" className="form-label">
                  Course <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="course"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  placeholder="e.g., Computer Science"
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialization" className="form-label">
                Specialization <span className="required">*</span>
              </label>
              <input
                type="text"
                id="specialization"
                className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                placeholder="e.g., Software Engineering"
                required
                disabled={loading || mode === 'view'}
                readOnly={mode === 'view'}
              />
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

export default CreateQualificationModal; 