import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import CreateUserModel from './CreateUserModel';
import './UserRoles.scss';
import { getUserRoles, deleteUserRole } from '../../../Connection/Auth';
import { useAuth } from '../../../Context/AuthContext';

interface Role {
  _id: string;
  name: string;
  description?: string;
  code?: string;
  permissions: string[];
  __v: number;
}

const UserRoles = () => {
  const { setTitle } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set header title when component mounts
  useEffect(() => {
    setTitle('User Roles');
  }, [setTitle]);

  const filteredRoles = (roles || []).filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.code && role.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddRole = () => {
    setModalMode('create');
    setSelectedRole(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(undefined);
  };

  const handleCreateRole = (roleData: {
    name: string;
    code: string;
    description: string;
    permissions: string[];
  }) => {
    const newRole: Role = {
      _id: (roles.length + 1).toString(),
      name: roleData.name,
      description: roleData.description,
      code: roleData.code,
      permissions: roleData.permissions,
      __v: 0
    };

    setRoles(prevRoles => [...prevRoles, newRole]);
  };

  const handleUpdateRole = (roleData: {
    name: string;
    code: string;
    description: string;
    permissions: string[];
  }) => {
    if (selectedRole) {
      const updatedRole: Role = {
        ...selectedRole,
        name: roleData.name,
        description: roleData.description,
        code: roleData.code,
        permissions: roleData.permissions
      };

      setRoles(prevRoles => 
        prevRoles.map(role => 
          role._id === selectedRole._id ? updatedRole : role
        )
      );
    }
  };

  const handleViewRole = (roleId: string) => {
    const role = roles.find(r => r._id === roleId);
    if (role) {
      setSelectedRole(role);
      setModalMode('view');
      setIsModalOpen(true);
    }
  };

  const handleEditRole = (roleId: string) => {
    const role = roles.find(r => r._id === roleId);
    if (role) {
      setSelectedRole(role);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r._id === roleId);
    if (role) {
      setRoleToDelete(role);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteUserRole(roleToDelete._id);
      setRoles(prevRoles => prevRoles.filter(role => role._id !== roleToDelete._id));
      setIsDeleteModalOpen(false);
      setRoleToDelete(undefined);
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(undefined);
  };

  const handleModalSubmit = (roleData: {
    name: string;
    code: string;
    description: string;
    permissions: string[];
  }) => {
    if (modalMode === 'create') {
      handleCreateRole(roleData);
    } else if (modalMode === 'edit') {
      handleUpdateRole(roleData);
    }
  };

  useEffect(() => {
    getUserRoles()
      .then((data) => {
        if (data && data.results && Array.isArray(data.results)) {
          setRoles(data.results);
        } else if (Array.isArray(data)) {
          setRoles(data);
        } else {
          setRoles([]);
        }
      })
      .catch(() => {
        setRoles([]);
      });
  }, []);

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="section-header">
          <div className="section-header__content">
            <div className="section-header__title-section">
              <p className="section-header__subtitle">Manage user roles and their permissions</p>
            </div>
            <button 
              className="btn btn--primary"
              onClick={handleAddRole}
            >
              <Plus size={16} />
              <span>Add Role</span>
            </button>
          </div>
        </div>

        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search roles by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead className="table__header">
              <tr>
                <th>ROLE NAME</th>
                <th>CODE</th>
                <th>PERMISSIONS COUNT</th>
                <th>DESCRIPTION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table__body">
              {filteredRoles.map((role) => (
                <tr key={role._id} className="table__row">
                  <td>
                    <div className="data-info">
                      <span className="data-info__title">{role.name}</span>
                      <span className="data-info__description">Role ID: {role._id}</span>
                    </div>
                  </td>
                  <td>
                    {role.code ? (
                      <span className="tag tag--primary">{role.code}</span>
                    ) : (
                      <span className="text-secondary">No code</span>
                    )}
                  </td>
                  <td className="text-secondary font-medium">
                    {role.permissions.length} permissions
                  </td>
                  <td className="text-secondary font-medium">
                    {role.description || 'No description'}
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn btn--icon btn--icon--view"
                        onClick={() => handleViewRole(role._id)}
                        title="View role"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn--icon btn--icon--edit"
                        onClick={() => handleEditRole(role._id)}
                        title="Edit role"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn--icon btn--icon--delete"
                        onClick={() => handleDeleteRole(role._id)}
                        title="Delete role"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateUserModel
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        roleData={selectedRole}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal-container">
            <div className="delete-modal-header">
              <h2 className="delete-modal-title">Delete Role</h2>
            </div>
            <div className="delete-modal-content">
              <div className="delete-warning">
                <Trash2 size={48} className="delete-icon" />
                <h3>Are you sure you want to delete this role?</h3>
                <p>
                  You are about to delete the role <strong>"{roleToDelete?.name}"</strong>. 
                  This action cannot be undone and will permanently remove the role and all its associated permissions.
                </p>
                <div className="role-details">
                  <div className="role-detail">
                    <span className="detail-label">Role Name:</span>
                    <span className="detail-value">{roleToDelete?.name}</span>
                  </div>
                  <div className="role-detail">
                    <span className="detail-label">Role Code:</span>
                    <span className="detail-value">{roleToDelete?.code || 'No code'}</span>
                  </div>
                  <div className="role-detail">
                    <span className="detail-label">Permissions:</span>
                    <span className="detail-value">{roleToDelete?.permissions.length} permissions</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="delete-modal-actions">
              <button 
                type="button" 
                className="btn btn--secondary" 
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn--danger" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Role</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoles;
