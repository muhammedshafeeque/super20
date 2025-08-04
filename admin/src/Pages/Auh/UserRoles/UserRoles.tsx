import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import './UserRoles.scss';

interface Role {
  id: string;
  name: string;
  description: string;
  code: string;
  permissionsCount: number;
  createdDate: string;
}

const UserRoles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      code: 'SUPER_ADMIN',
      permissionsCount: 25,
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Administrative access with user and course management',
      code: 'ADMIN',
      permissionsCount: 18,
      createdDate: '2024-01-20'
    },
    {
      id: '3',
      name: 'Instructor',
      description: 'Teaching staff with course and student management',
      code: 'INSTRUCTOR',
      permissionsCount: 12,
      createdDate: '2024-02-01'
    },
    {
      id: '4',
      name: 'Student',
      description: 'Basic student access for learning activities',
      code: 'STUDENT',
      permissionsCount: 5,
      createdDate: '2024-02-10'
    }
  ]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = () => {
    console.log('Add role clicked');
    // TODO: Implement add role functionality
  };

  const handleViewRole = (roleId: string) => {
    console.log('View role:', roleId);
    // TODO: Implement view role functionality
  };

  const handleEditRole = (roleId: string) => {
    console.log('Edit role:', roleId);
    // TODO: Implement edit role functionality
  };

  const handleDeleteRole = (roleId: string) => {
    console.log('Delete role:', roleId);
    // TODO: Implement delete role functionality
  };

  return (
    <div className="user-roles" >
      <div className="user-roles__container" >
        {/* Header Section */}
        <div className="user-roles__header">
          <div className="user-roles__header-content">
            <div className="user-roles__title-section">
              <h1 className="user-roles__title">Roles Management</h1>
              <p className="user-roles__subtitle">Manage user roles and their permissions</p>
            </div>
            <button 
              className="user-roles__add-button"
              onClick={handleAddRole}
            >
              <Plus size={16} />
              <span>Add Role</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="user-roles__search">
          <div className="user-roles__search-container">
            <Search className="user-roles__search-icon" size={20} />
            <input
              type="text"
              placeholder="Search roles by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="user-roles__search-input"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="user-roles__table-container">
          <table className="user-roles__table">
            <thead className="user-roles__table-header">
              <tr>
                <th>ROLE NAME</th>
                <th>CODE</th>
                <th>PERMISSIONS COUNT</th>
                <th>CREATED DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="user-roles__table-body">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="user-roles__table-row">
                  <td className="user-roles__role-name">
                    <div className="user-roles__role-info">
                      <span className="user-roles__role-title">{role.name}</span>
                      <span className="user-roles__role-description">{role.description}</span>
                    </div>
                  </td>
                  <td className="user-roles__role-code">
                    <span className="user-roles__code-tag">{role.code}</span>
                  </td>
                  <td className="user-roles__permissions-count">
                    {role.permissionsCount} permissions
                  </td>
                  <td className="user-roles__created-date">
                    {role.createdDate}
                  </td>
                  <td className="user-roles__actions">
                    <div className="user-roles__action-buttons">
                      <button
                        className="user-roles__action-btn user-roles__action-btn--view"
                        onClick={() => handleViewRole(role.id)}
                        title="View role"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="user-roles__action-btn user-roles__action-btn--edit"
                        onClick={() => handleEditRole(role.id)}
                        title="Edit role"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="user-roles__action-btn user-roles__action-btn--delete"
                        onClick={() => handleDeleteRole(role.id)}
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
    </div>
  );
};

export default UserRoles;
