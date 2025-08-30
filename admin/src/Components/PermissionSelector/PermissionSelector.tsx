import React, { useState, useEffect } from 'react';
import { X, Plus, FileText, Edit, Trash2, Search, Check, Square, ChevronDown, ChevronRight } from 'lucide-react';
import { getPermissions } from '../../Connection/Auth';
import './PermissionSelector.scss';

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onPermissionsChange: (permissions: string[]) => void;
  mode?: 'create' | 'edit' | 'view';
  loading?: boolean;
  disabled?: boolean;
  showSearch?: boolean;
  showQuickSelect?: boolean;
  showSelectedSummary?: boolean;
  expandedModules?: Set<string>;
  onModuleToggle?: (moduleName: string) => void;
}

const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  selectedPermissions,
  onPermissionsChange,
  mode = 'edit',
  loading = false,
  disabled = false,
  showSearch = true,
  showQuickSelect = true,
  showSelectedSummary = true,
  expandedModules = new Set(['USER']),
  onModuleToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [permissions, setPermissions] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getPermissions();
        setPermissions(response);
      } catch (err) {
        setError('Failed to fetch permissions');
      }
    };
    
    fetchPermissions();
  }, [mode]); // Re-fetch when mode changes

  // Transform permissions to match user role structure
  const permissionModules = Object.entries(permissions).map(([moduleName, operations]: [string, any]) => ({
    module: moduleName,
    displayName: moduleName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    operations: Object.entries(operations).map(([operationKey, permissionValue]: [string, any]) => {
      // Handle permission key formats: user_create or user.create
      let operationType;
      if (operationKey.includes('_')) {
        // Format: user_create -> create
        operationType = operationKey.split('_')[1];
      } else if (operationKey.includes('.')) {
        // Format: user.create -> create
        operationType = operationKey.split('.')[1];
      } else {
        // Fallback
        operationType = operationKey;
      }
      
      return {
        key: operationKey,
        value: permissionValue,
        displayName: operationType.charAt(0).toUpperCase() + operationType.slice(1),
        description: `${operationType} ${moduleName.replace('_', ' ').toLowerCase()}`
      };
    })
  }));



  // Filter modules based on search term
  const filteredModules = permissionModules.filter(module =>
    module.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.operations.some(op => 
      op.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle permission toggle
  const handlePermissionToggle = (permissionValue: string) => {
    if (mode === 'view' || disabled) return;
    const newPermissions = selectedPermissions.includes(permissionValue)
      ? selectedPermissions.filter(p => p !== permissionValue)
      : [...selectedPermissions, permissionValue];
    onPermissionsChange(newPermissions);
  };

  // Handle select all module
  const handleSelectAllModule = (moduleName: string) => {
    if (mode === 'view' || disabled) return;
    const modulePermissions = permissionModules
      .find(m => m.module === moduleName)
      ?.operations.map(op => op.value) || [];
    
    const allSelected = modulePermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      const newPermissions = selectedPermissions.filter(p => !modulePermissions.includes(p));
      onPermissionsChange(newPermissions);
    } else {
      const newPermissions = [...new Set([...selectedPermissions, ...modulePermissions])];
      onPermissionsChange(newPermissions);
    }
  };

  // Handle select all operations
  const handleSelectAllOperations = (operationType: string) => {
    if (mode === 'view' || disabled) return;
    const operationPermissions = permissionModules
      .flatMap(m => m.operations)
      .filter(op => {
        // Check if the operation key contains the operation type
        // Handle both user_create and user.create formats
        if (op.key.includes('_')) {
          return op.key.split('_')[1] === operationType;
        } else if (op.key.includes('.')) {
          return op.key.split('.')[1] === operationType;
        }
        return op.key.includes(operationType);
      })
      .map(op => op.value);
    
    const allSelected = operationPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      const newPermissions = selectedPermissions.filter(p => !operationPermissions.includes(p));
      onPermissionsChange(newPermissions);
    } else {
      const newPermissions = [...new Set([...selectedPermissions, ...operationPermissions])];
      onPermissionsChange(newPermissions);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (mode === 'view' || disabled) return;
    const allPermissions = permissionModules.flatMap(m => m.operations.map(op => op.value));
    const allSelected = allPermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      onPermissionsChange([]);
    } else {
      onPermissionsChange(allPermissions);
    }
  };

  // Handle module expand/collapse
  const handleModuleToggle = (moduleName: string) => {
    if (mode === 'view' || disabled) return;
    if (onModuleToggle) {
      onModuleToggle(moduleName);
    }
  };

  // Remove permission from selected
  const removePermission = (permission: string) => {
    if (mode === 'view' || disabled) return;
    const newPermissions = selectedPermissions.filter(p => p !== permission);
    onPermissionsChange(newPermissions);
  };

  // Get operation icon
  const getOperationIcon = (operationType: string) => {
    switch (operationType) {
      case 'create': return <Plus size={14} />;
      case 'read': return <FileText size={14} />;
      case 'update': return <Edit size={14} />;
      case 'delete': return <Trash2 size={14} />;
      default: return <FileText size={14} />;
    }
  };

  // Get operation color
  const getOperationColor = (operationType: string) => {
    switch (operationType) {
      case 'create': return '#10b981';
      case 'read': return '#3b82f6';
      case 'update': return '#f59e0b';
      case 'delete': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (error) {
    return (
      <div className="permission-selector-error">
        <p>{error}</p>
      </div>
    );
  }

  if (Object.keys(permissions).length === 0) {
    return (
      <div className="permission-selector-loading">
        <div className="loading-spinner"></div>
        <p>Loading permissions...</p>
      </div>
    );
  }

  return (
    <div className="permission-selector">
      {/* Header Controls */}
      {showSearch && (
        <div className="header-controls">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading || disabled || mode === 'view'}
            />
          </div>
          {mode !== 'view' && (
            <button 
              className="btn btn--secondary" 
              onClick={handleSelectAll}
              disabled={loading || disabled}
            >
              {permissionModules.flatMap(m => m.operations).every(op => 
                selectedPermissions.includes(op.value)
              ) ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
      )}

      {/* Quick Select by Operation */}
      {showQuickSelect && mode !== 'view' && (
        <div className="quick-select-section">
          <h4 className="quick-select-title">Quick Select by Operation</h4>
          <div className="quick-select-buttons">
            {['create', 'read', 'update', 'delete'].map(operationType => (
              <button
                key={operationType}
                className="quick-select-btn"
                style={{ 
                  '--operation-color': getOperationColor(operationType) 
                } as React.CSSProperties}
                onClick={() => handleSelectAllOperations(operationType)}
                disabled={loading || disabled}
              >
                {getOperationIcon(operationType)}
                <span>{operationType.charAt(0).toUpperCase() + operationType.slice(1)} All</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Permission Modules */}
      <div className="permissions-container">
        {filteredModules.map((module) => {
          const modulePermissions = module.operations.map(op => op.value);
          const allSelected = modulePermissions.every(p => selectedPermissions.includes(p));
          const isExpanded = expandedModules.has(module.module);
          

          
          return (
            <div key={module.module} className="permission-category">
              <div 
                className="category-header"
                onClick={() => handleModuleToggle(module.module)}
              >
                <div className="header-left">
                  <span className="expand-icon">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <h4 className="category-title">{module.displayName}</h4>
                </div>
                {mode !== 'view' && (
                  <button
                    className={`category-action-btn ${allSelected ? 'deselect' : 'select'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAllModule(module.module);
                    }}
                    disabled={loading || disabled}
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
              
              {isExpanded && (
                <div className="permission-items">
                  {module.operations.map((operation) => {
                    // Handle permission key formats: user_create or user.create
                    let operationType;
                    if (operation.key.includes('_')) {
                      // Format: user_create -> create
                      operationType = operation.key.split('_')[1];
                    } else if (operation.key.includes('.')) {
                      // Format: user.create -> create
                      operationType = operation.key.split('.')[1];
                    } else {
                      // Fallback
                      operationType = operation.key;
                    }
                    const isSelected = selectedPermissions.includes(operation.value);
                    
                    return (
                      <div key={operation.value} className="permission-item">
                        <label className={`permission-checkbox ${mode === 'view' ? 'permission-checkbox--readonly' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePermissionToggle(operation.value)}
                            disabled={loading || disabled || mode === 'view'}
                          />
                          <span className="checkbox-icon">
                            {isSelected ? <Check size={14} /> : <Square size={14} />}
                          </span>
                          <span className="operation-icon" style={{ color: getOperationColor(operationType) }}>
                            {getOperationIcon(operationType)}
                          </span>
                          <div className="permission-info">
                            <span className="permission-label">{operation.displayName}</span>
                            <span className="permission-description">{operation.description}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Permissions Summary */}
      {showSelectedSummary && selectedPermissions.length > 0 && (
        <div className="selected-permissions-summary">
          <h4 className="summary-title">Selected Permissions ({selectedPermissions.length})</h4>
          <div className="selected-permissions-tags">
            {selectedPermissions.map((permissionValue) => {
              const operation = permissionModules
                .flatMap(m => m.operations)
                .find(op => op.value === permissionValue);
              
              return operation ? (
                <div key={permissionValue} className="permission-tag">
                  <span className="tag-content">
                    {(() => {
                      let operationType;
                      if (operation.key.includes('_')) {
                        operationType = operation.key.split('_')[1];
                      } else if (operation.key.includes('.')) {
                        operationType = operation.key.split('.')[1];
                      } else {
                        operationType = operation.key;
                      }
                      return getOperationIcon(operationType);
                    })()}
                    {operation.displayName} {(() => {
                      if (operation.key.includes('_')) {
                        return operation.key.split('_')[0];
                      } else if (operation.key.includes('.')) {
                        return operation.key.split('.')[0];
                      } else {
                        return operation.key;
                      }
                    })()}
                  </span>
                  {mode !== 'view' && (
                    <button
                      className="remove-tag-btn"
                      onClick={() => removePermission(permissionValue)}
                      disabled={loading || disabled}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionSelector;
