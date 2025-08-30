import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import PermissionSelector from '../../../Components/PermissionSelector';
import './CreateUserModel.scss';
import { createUserRole, updateUserRole } from '../../../Connection/Auth';

interface Role {
  _id: string;
  name: string;
  description?: string;
  code?: string;
  permissions: string[];
  __v: number;
}

interface CreateUserModelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  roleData?: Role;
  onSubmit: (roleData: {
    name: string;
    code: string;
    description: string;
    permissions: string[];
  }) => void;
}

const CreateUserModel: React.FC<CreateUserModelProps> = ({ isOpen, onClose, mode, roleData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',                                                       
    code: '',
    description: ''
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['USER']));

  useEffect(() => {
    if (roleData && mode !== 'create') {
      setFormData({
        name: roleData.name || '',
        code: roleData.code || '',
        description: roleData.description || ''
      });
      setSelectedPermissions(roleData.permissions || []);
    } else {
      setFormData({ name: '', code: '', description: '' });
      setSelectedPermissions([]);
    }
  }, [roleData, mode]);

  const handleInputChange = (field: string, value: string) => {
    if (mode === 'view') return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle module expand/collapse
  const handleModuleToggle = (moduleName: string) => {
    if (mode === 'view') return;
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleName)) {
        newSet.delete(moduleName);
    } else {
        newSet.add(moduleName);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    
    if (!formData.name.trim() || !formData.code.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        permissions: selectedPermissions
      };
      
      if (mode === 'create') {
        await createUserRole(submitData.name, submitData.code, submitData.description, submitData.permissions);
      } else if (mode === 'edit' && roleData) {
        await updateUserRole(roleData._id, submitData.name, submitData.code, submitData.description, submitData.permissions);
      }
      
      onSubmit(submitData);
      
      if (mode === 'create') {
        setFormData({ name: '', code: '', description: '' });
        setSelectedPermissions([]);
      }
      onClose();
    } catch (err) {
      setError(`Failed to ${mode} role. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (mode === 'create') {
      setFormData({ name: '', code: '', description: '' });
      setSelectedPermissions([]);
    }
    setError(null);
    onClose();
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Role';
      case 'edit': return 'Edit Role';
      case 'view': return 'View Role';
      default: return 'Role';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'create': return 'Create Role';
      case 'edit': return 'Update Role';
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
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="roleName" className="form-label">
                  Role Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="roleName"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter role name"
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="roleCode" className="form-label">
                  Role Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="roleCode"
                  className={`form-input ${mode === 'view' ? 'form-input--readonly' : ''}`}
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="e.g., ADMIN_ROLE"
                  required
                  disabled={loading || mode === 'view'}
                  readOnly={mode === 'view'}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="roleDescription" className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="roleDescription"
                className={`form-textarea ${mode === 'view' ? 'form-textarea--readonly' : ''}`}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the role and its responsibilities"
                rows={3}
                required
                disabled={loading || mode === 'view'}
                readOnly={mode === 'view'}
              />
            </div>
          </div>

          <div className="form-section">
              <h3 className="form-section-title">Permissions Management</h3>
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onPermissionsChange={setSelectedPermissions}
              mode={mode}
              loading={loading}
                      disabled={loading}
              showSearch={true}
              showQuickSelect={true}
              showSelectedSummary={true}
              expandedModules={expandedModules}
              onModuleToggle={handleModuleToggle}
            />
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

export default CreateUserModel;
