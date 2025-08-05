import React, { useEffect, useState } from 'react';
import { X, Save, Plus, Trash2, Check, Square, Edit } from 'lucide-react';
import './CreateUserModel.scss';
import { getPermissions, createUserRole, updateUserRole } from '../../../Connection/Auth';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await getPermissions();
        setPermissions(response);
      } catch (err) {
        setError('Failed to fetch permissions');
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchPermissions();
    }
  }, [isOpen]);

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

  const permissionModules = Object.entries(permissions).map(([moduleName, operations]: [string, any]) => ({
    module: moduleName,
    displayName: moduleName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    operations: Object.entries(operations).map(([operationKey, permissionValue]: [string, any]) => ({
      key: operationKey,
      value: permissionValue,
      displayName: operationKey.split('_')[1]?.charAt(0).toUpperCase() + operationKey.split('_')[1]?.slice(1) || operationKey,
      description: `${operationKey.split('_')[1] || operationKey} ${moduleName.replace('_', ' ').toLowerCase()}`
    }))
  }));

  const filteredModules = permissionModules.filter(module =>
    module.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.operations.some(op => 
      op.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleInputChange = (field: string, value: string) => {
    if (mode === 'view') return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePermissionToggle = (permissionValue: string) => {
    if (mode === 'view') return;
    setSelectedPermissions(prev => 
      prev.includes(permissionValue)
        ? prev.filter(p => p !== permissionValue)
        : [...prev, permissionValue]
    );
  };

  const handleSelectAllModule = (moduleName: string) => {
    if (mode === 'view') return;
    const modulePermissions = permissionModules
      .find(m => m.module === moduleName)
      ?.operations.map(op => op.value) || [];
    
    const allSelected = modulePermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !modulePermissions.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissions])]);
    }
  };

  const handleSelectAllOperations = (operationType: string) => {
    if (mode === 'view') return;
    const operationPermissions = permissionModules
      .flatMap(m => m.operations)
      .filter(op => op.key.includes(operationType))
      .map(op => op.value);
    
    const allSelected = operationPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !operationPermissions.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...operationPermissions])]);
    }
  };

  const handleSelectAll = () => {
    if (mode === 'view') return;
    const allPermissions = permissionModules.flatMap(m => m.operations.map(op => op.value));
    const allSelected = allPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(allPermissions);
    }
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
        setSearchTerm('');
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
      setSearchTerm('');
    }
    setError(null);
    onClose();
  };

  const getOperationIcon = (operationType: string) => {
    switch (operationType) {
      case 'create': return <Plus size={14} />;
      case 'read': return <Square size={14} />;
      case 'update': return <Save size={14} />;
      case 'delete': return <Trash2 size={14} />;
      default: return null;
    }
  };

  const getOperationColor = (operationType: string) => {
    switch (operationType) {
      case 'create': return '#10b981';
      case 'read': return '#3b82f6';
      case 'update': return '#f59e0b';
      case 'delete': return '#ef4444';
      default: return '#6b7280';
    }
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
            <div className="permissions-header">
              <h3 className="form-section-title">Permissions Management</h3>
              {mode !== 'view' && (
                <div className="permissions-controls">
                  <div className="permissions-search">
                    <input
                      type="text"
                      className="permissions-search-input"
                      placeholder="Search permissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="button"
                    className="select-all-btn"
                    onClick={handleSelectAll}
                    disabled={loading}
                  >
                    {permissionModules.flatMap(m => m.operations).every(op => 
                      selectedPermissions.includes(op.value)
                    ) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              )}
            </div>

            {loading && !permissions || Object.keys(permissions).length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading permissions...</p>
              </div>
            ) : (
              <>
                {mode !== 'view' && (
                  <div className="operation-quick-select">
                    <h4 className="operation-quick-select-title">Quick Select by Operation</h4>
                    <div className="operation-buttons">
                      {['create', 'read', 'update', 'delete'].map(operationType => (
                        <button
                          key={operationType}
                          type="button"
                          className="operation-btn"
                          style={{ 
                            '--operation-color': getOperationColor(operationType) 
                          } as React.CSSProperties}
                          onClick={() => handleSelectAllOperations(operationType)}
                          disabled={loading}
                        >
                          {getOperationIcon(operationType)}
                          <span>{operationType.charAt(0).toUpperCase() + operationType.slice(1)} All</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="permissions-container">
                  {filteredModules.map((module) => (
                    <div key={module.module} className="permission-category">
                      <div className="permission-category-header">
                        <h4 className="permission-category-title">{module.displayName}</h4>
                        {mode !== 'view' && (
                          <button
                            type="button"
                            className="select-all-btn"
                            onClick={() => handleSelectAllModule(module.module)}
                            disabled={loading}
                          >
                            {module.operations.every(op => selectedPermissions.includes(op.value)) ? 'Deselect All' : 'Select All'}
                          </button>
                        )}
                      </div>
                      
                      <div className="permission-list">
                        {module.operations.map(operation => (
                          <div key={operation.value} className="permission-item">
                            <label className={`permission-checkbox ${mode === 'view' ? 'permission-checkbox--readonly' : ''}`}>
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(operation.value)}
                                onChange={() => handlePermissionToggle(operation.value)}
                                disabled={loading || mode === 'view'}
                              />
                              <span className="permission-info">
                                <div className="permission-header">
                                  <span 
                                    className="permission-operation"
                                    style={{ color: getOperationColor(operation.key.split('_')[1]) }}
                                  >
                                    {getOperationIcon(operation.key.split('_')[1])}
                                    {operation.displayName}
                                  </span>
                                </div>
                                <span className="permission-description">{operation.description}</span>
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPermissions.length > 0 && (
                  <div className="selected-permissions">
                    <h4 className="selected-permissions-title">
                      Selected Permissions ({selectedPermissions.length})
                    </h4>
                    <div className="selected-permissions-list">
                      {selectedPermissions.map(permissionValue => {
                        const operation = permissionModules
                          .flatMap(m => m.operations)
                          .find(op => op.value === permissionValue);
                        
                        return operation ? (
                          <span 
                            key={permissionValue} 
                            className="selected-permission-tag"
                            style={{ 
                              '--operation-color': getOperationColor(operation.key.split('_')[1]) 
                            } as React.CSSProperties}
                          >
                            {getOperationIcon(operation.key.split('_')[1])}
                            {operation.displayName} {operation.key.split('_')[0]}
                            {mode !== 'view' && (
                              <button
                                type="button"
                                className="remove-permission-btn"
                                onClick={() => handlePermissionToggle(permissionValue)}
                                disabled={loading}
                              >
                                <X size={12} />
                              </button>
                            )}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
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
