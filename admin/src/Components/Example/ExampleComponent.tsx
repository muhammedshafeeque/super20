import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, User, Mail, Phone } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdDate: string;
}

const ExampleComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      status: 'active',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      status: 'inactive',
      createdDate: '2024-01-20'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 234 567 8902',
      status: 'pending',
      createdDate: '2024-02-01'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="tag tag--success">Active</span>;
      case 'inactive':
        return <span className="tag tag--danger">Inactive</span>;
      case 'pending':
        return <span className="tag tag--info">Pending</span>;
      default:
        return <span className="tag tag--secondary">{status}</span>;
    }
  };

  const handleAddUser = () => {
    console.log('Add user clicked');
  };

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId);
  };

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
  };

  return (
    <div className="page-container">
      <div className="content-card">
        {/* Header Section */}
        <div className="section-header">
          <div className="section-header__content">
            <div className="section-header__title-section">
              <h1 className="section-header__title">User Management</h1>
              <p className="section-header__subtitle">Manage system users and their information</p>
            </div>
            <button 
              className="btn btn--primary"
              onClick={handleAddUser}
            >
              <Plus size={16} />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container">
          <table className="table">
            <thead className="table__header">
              <tr>
                <th>USER INFO</th>
                <th>CONTACT</th>
                <th>STATUS</th>
                <th>CREATED DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table__body">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table__row">
                  <td>
                    <div className="data-info">
                      <span className="data-info__title">{user.name}</span>
                      <span className="data-info__description">User ID: {user.id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="data-info">
                      <span className="data-info__title">{user.email}</span>
                      <span className="data-info__description">{user.phone}</span>
                    </div>
                  </td>
                  <td>
                    {getStatusTag(user.status)}
                  </td>
                  <td className="text-secondary font-medium">
                    {user.createdDate}
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn btn--icon btn--icon--view"
                        onClick={() => handleViewUser(user.id)}
                        title="View user"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn--icon btn--icon--edit"
                        onClick={() => handleEditUser(user.id)}
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn--icon btn--icon--delete"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
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

export default ExampleComponent; 