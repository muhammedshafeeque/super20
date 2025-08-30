import React, { useEffect, useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, User, Mail, Phone, Shield } from 'lucide-react';
import Pagination from '../../../Components/Pagination/Paginations';
import CreateEmployeeModal from './CreateEmployeeModal';
import EditPermissionsModal from './EditPermissionsModal';
import './Employees.scss';
import { getEmployees, deleteEmployee, createEmployee, updateEmployee, updateEmployeePermissions } from '../../../Connection/Auth';
import { useAuth } from '../../../Context/AuthContext';

interface EmployeeProfile {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    permissions: string[];
  };
  name: string;
  age?: number;
  gender?: string;
  profilePicture?: string;
  status: string;
  userType: string;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  isSuspended: boolean;
  educationalQualifications: any[];
  dateOfBirth: string;
  dateOfJoining: string;
  userRole: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userRoleName: string;
  userRoleCode: string;
  userRolePermissions: string[];
  userPermissions: string[];
  userPermissionCount: number;
  userRolePermissionCount: number;
}

const Employees = () => {
  const { setTitle } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeProfile | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | undefined>(undefined);
  
  // Permissions modal state
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedEmployeeForPermissions, setSelectedEmployeeForPermissions] = useState<EmployeeProfile | undefined>(undefined);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // Set header title when component mounts
  useEffect(() => {
    setTitle('Employees');
  }, [setTitle]);

  // Fetch employees with pagination and filters
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * itemsPerPage;
      const queryParams: any = {
        skip,
        limit: itemsPerPage
      };

      if (searchTerm.trim()) {
        queryParams.search = searchTerm;
      }

      const response = await getEmployees(queryParams);
      const employees = response.result || response.employees || response.data || [];
      const count = response.count || 0;
      
      if (Array.isArray(employees)) {
        setEmployees(employees);
        setTotalItems(count);
        setTotalPages(Math.ceil(count / itemsPerPage));
      } else {
        setEmployees([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setModalMode('create');
    setSelectedEmployee(undefined);
    setIsModalOpen(true);
  };

  const handleViewEmployee = (employeeId: string) => {
    const employee = employees.find(e => e._id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setModalMode('view');
      setIsModalOpen(true);
    }
  };

  const handleEditEmployee = (employeeId: string) => {
    const employee = employees.find(e => e._id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleEditPermissions = (employeeId: string) => {
    const employee = employees.find(e => e._id === employeeId);
    if (employee) {
      setSelectedEmployeeForPermissions(employee);
      setIsPermissionsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleModalSubmit = async (employeeData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    dateOfJoining: string;
    userRole: string;
    gender: string;
    educationalQualifications: any[];
  }) => {
    try {
      if (modalMode === 'create') {
        await createEmployee(employeeData);
      } else if (modalMode === 'edit' && selectedEmployee) {
        await updateEmployee(selectedEmployee._id, employeeData);
      }
      
      // Refetch employees after successful operation
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handlePermissionsSubmit = async (employeeId: string, permissions: string[]) => {
    try {
      await updateEmployeePermissions(employeeId, permissions);
      // Refetch employees after successful operation
      fetchEmployees();
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employees.find(e => e._id === employeeId);
    if (employee) {
      setEmployeeToDelete(employee);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteEmployee(employeeToDelete._id);
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee._id !== employeeToDelete._id));
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(undefined);
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Use employees directly since filtering is done on the server
  const filteredEmployees = employees;

  // Fetch employees when component mounts or when pagination/search changes
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, itemsPerPage, searchTerm]);

  const getGenderColor = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'male': return '#3b82f6';
      case 'female': return '#ec4899';
      case 'other': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getGenderIcon = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'other': return '👤';
      default: return '👤';
    }
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="section-header">
          <div className="section-header__content">
            <div className="section-header__title-section">
              <p className="section-header__subtitle">Manage employees and their information</p>
            </div>
            <button 
              className="btn btn--primary"
              onClick={handleAddEmployee}
            >
              <Plus size={16} />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={16} />
            </button>
            {searchTerm && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading employees...</p>
            </div>
          ) : (
            <table className="table">
              <thead className="table__header">
                <tr>
                  <th>EMPLOYEE</th>
                  <th>CONTACT</th>
                  <th>ROLE & PERMISSIONS</th>
                  <th>GENDER</th>
                  <th>AGE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table__body">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-data">
                      <div className="no-data-content">
                        <User size={48} className="no-data-icon" />
                        <h3>No employees found</h3>
                        <p>
                          {searchTerm 
                            ? `No employees match your search for "${searchTerm}"`
                            : 'Get started by adding your first employee'
                          }
                        </p>
                        {!searchTerm && (
                          <button 
                            className="btn btn--primary"
                            onClick={handleAddEmployee}
                          >
                            <Plus size={16} />
                            <span>Add Employee</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="table__row">
                      <td>
                        <div className="data-info">
                        
                          <div className="employee-details">
                            <span className="data-info__title">{employee.name || 'No Name'}</span>
                            <span className="data-info__description">ID: {employee._id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <Mail size={14} className="contact-icon" />
                            <span className="contact-text">{employee.user?.email || 'No email'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-permissions-info">
                          <div className="role-info">
                            <span className="role-name">{employee.userRoleName || 'No Role'}</span>
                            {employee.userRoleCode && (
                              <span className="role-code">({employee.userRoleCode})</span>
                            )}
                          </div>
                          <div className="permissions-info">
                            <span className="permission-count">
                              User: {employee.userPermissionCount || 0} perms
                            </span>
                            <span className="permission-count">
                              Role: {employee.userRolePermissionCount || 0} perms
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {employee.gender ? (
                          <span 
                            className="tag tag--primary"
                            style={{ 
                              backgroundColor: getGenderColor(employee.gender),
                              borderColor: getGenderColor(employee.gender)
                            }}
                          >
                            <span className="gender-icon">{getGenderIcon(employee.gender)}</span>
                            {employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)}
                          </span>
                        ) : (
                          <span className="text-secondary">Not specified</span>
                        )}
                      </td>
                      <td className="text-secondary font-medium">
                        {employee.age ? `${employee.age} years` : 'Not specified'}
                      </td>
                      <td>
                        <div className="action-group">
                          <button
                            className="btn btn--icon btn--icon--view"
                            onClick={() => handleViewEmployee(employee._id)}
                            title="View employee"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn--icon btn--icon--edit"
                            onClick={() => handleEditEmployee(employee._id)}
                            title="Edit employee"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn--icon btn--icon--permissions"
                            onClick={() => handleEditPermissions(employee._id)}
                            title="Edit permissions"
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            className="btn btn--icon btn--icon--delete"
                            onClick={() => handleDeleteEmployee(employee._id)}
                            title="Delete employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage={true}
          />
        )}
      </div>

      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        employeeData={selectedEmployee}
        onSubmit={handleModalSubmit}
      />

      <EditPermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        employeeData={selectedEmployeeForPermissions}
        onSubmit={handlePermissionsSubmit}
        mode="edit"
      />
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal-container">
            <div className="delete-modal-header">
              <h2 className="delete-modal-title">Delete Employee</h2>
            </div>
            <div className="delete-modal-content">
              <div className="delete-warning">
                <Trash2 size={48} className="delete-icon" />
                <h3>Are you sure you want to delete this employee?</h3>
                <p>
                  You are about to delete the employee <strong>"{employeeToDelete?.name}"</strong>. 
                  This action cannot be undone and will permanently remove the employee and all their associated data.
                </p>
                <div className="employee-details">
                  <div className="employee-detail">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{employeeToDelete?.name}</span>
                  </div>
                  <div className="employee-detail">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{employeeToDelete?.user?.email || 'No email'}</span>
                  </div>
                  <div className="employee-detail">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{employeeToDelete?.gender || 'Not specified'}</span>
                  </div>
                  <div className="employee-detail">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{employeeToDelete?.age ? `${employeeToDelete.age} years` : 'Not specified'}</span>
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
                    <span>Delete Employee</span>
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

export default Employees;
