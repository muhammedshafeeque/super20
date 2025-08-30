import React, { useState, useEffect } from 'react';
import { X, Edit, Check } from 'lucide-react';
import PermissionSelector from '../../../Components/PermissionSelector';
import './EditPermissionsModal.scss';

interface EditPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  employeeData?: any;
  onSubmit: (employeeId: string, permissions: string[]) => Promise<void>;
}

const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  isOpen,
  onClose,
  mode,
  employeeData,
  onSubmit
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['USER']));

  // Initialize selected permissions
  useEffect(() => {
    if (employeeData && mode !== 'create') {
      const userPermissions = employeeData.user?.permissions || [];
      const directPermissions = employeeData.userPermissions || [];
      const finalPermissions = userPermissions.length > 0 ? userPermissions : directPermissions;
      
      setSelectedPermissions(finalPermissions);
    } else {
      setSelectedPermissions([]);
    }
  }, [employeeData, mode]);

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

  // Handle submit
  const handleSubmit = async () => {
    if (mode === 'view') return;
    try {
      setLoading(true);
      setError(null);
      if (employeeData?._id) {
        await onSubmit(employeeData._id, selectedPermissions);
        onClose();
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      setError('Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (mode === 'create') {
      setSelectedPermissions([]);
    }
    setError(null);
    onClose();
  };

  // Get modal title
  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create Permissions';
      case 'edit': return 'Edit Permissions';
      case 'view': return 'View Permissions';
      default: return 'Permissions';
    }
  };

  // Get submit button text
  const getSubmitButtonText = () => {
    switch (mode) {
      case 'create': return 'Create Permissions';
      case 'edit': return 'Update Permissions';
      case 'view': return 'Close';
      default: return 'Submit';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Permissions Management</h2>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-section">
            <PermissionSelector
              key={`employee-permissions-${employeeData?._id || 'new'}`}
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
        </div>

        <div className="modal-actions">
          <button className="btn btn--secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          {mode !== 'view' && (
            <button className="btn btn--primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  Submit
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPermissionsModal;
