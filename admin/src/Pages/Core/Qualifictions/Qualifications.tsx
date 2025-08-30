                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash2, GraduationCap } from 'lucide-react';
import CreateQualificationModal from './CreateQualificationModal';
import SearchForm from './SearchForm';
import Pagination from '../../../Components/Pagination/Paginations';
import './Qualifications.scss';
import { getQualifications, deleteQualification } from '../../../Connection/Core';
import { useAuth } from '../../../Context/AuthContext';

interface Qualification {
  _id: string;
  qualificationType: string;
  course: string;
  specialization: string;
  __v: number;
}

const Qualifications = () => {
  const { setTitle } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedQualification, setSelectedQualification] = useState<Qualification | undefined>(undefined);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [qualificationToDelete, setQualificationToDelete] = useState<Qualification | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Search form state
  const [searchParams, setSearchParams] = useState({
    course: '',
    courseType: '',
    specialization: ''
  });

  // Set header title when component mounts
  useEffect(() => {
    setTitle('Qualifications');
  }, [setTitle]);

  // Fetch qualifications with pagination and filters
  const fetchQualifications = async () => {
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const queryParams: any = {
        skip,
        limit: itemsPerPage
      };
      console.log(searchParams);
      let params = {
        ...queryParams,
        course: searchParams.course,
        qualificationType: searchParams.courseType,
        specialization: searchParams.specialization
      };  

      const response = await getQualifications(params);
      const data = response.data || response;
      
      if (data.results && Array.isArray(data.results)) {
        setQualifications(data.results);
        setTotalItems(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / itemsPerPage));
      } else if (Array.isArray(data)) {
        setQualifications(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else {
        setQualifications([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      setQualifications([]);
      setTotalItems(0);
      setTotalPages(0);
    }
  };

  const handleAddQualification = () => {
    setModalMode('create');
    setSelectedQualification(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQualification(undefined);
  };

  

  const handleViewQualification = (qualificationId: string) => {
    const qualification = qualifications.find(q => q._id === qualificationId);
    if (qualification) {
      setSelectedQualification(qualification);
      setModalMode('view');
      setIsModalOpen(true);
    }
  };

  const handleEditQualification = (qualificationId: string) => {
    const qualification = qualifications.find(q => q._id === qualificationId);
    if (qualification) {
      setSelectedQualification(qualification);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleDeleteQualification = (qualificationId: string) => {
    const qualification = qualifications.find(q => q._id === qualificationId);
    if (qualification) {
      setQualificationToDelete(qualification);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!qualificationToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteQualification(qualificationToDelete._id);
      setQualifications(prevQualifications => prevQualifications.filter(qualification => qualification._id !== qualificationToDelete._id));
      setIsDeleteModalOpen(false);
      setQualificationToDelete(undefined);
    } catch (error) {
      console.error('Error deleting qualification:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setQualificationToDelete(undefined);
  };

  const handleModalSubmit = (qualificationData: {
    qualificationType: string;
    course: string;
    specialization: string;
  }) => {
    // Refetch data after successful operation
    fetchQualifications();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearch = (data: { course: string; courseType: string; specialization: string }) => {
    setSearchParams(data);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchParams({
      course: '',
      courseType: '',
      specialization: ''
    });
    setCurrentPage(1);
  };



  // Fetch qualifications when component mounts or when pagination/search changes
  useEffect(() => {
    fetchQualifications();
  }, [currentPage, itemsPerPage, searchParams]);

  const getQualificationTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'bachelors': '#3b82f6',
      'masters': '#8b5cf6',
      'phd': '#dc2626',
      'diploma': '#059669',
      'certificate': '#d97706',
      'sslc': '#6b7280',
      'plus two': '#7c3aed',
      'iti': '#0891b2',
      'polytechnic': '#be185d',
      'vocational': '#ea580c',
      'apprenticeship': '#16a34a',
      'associate': '#9333ea',
      'postgraduate': '#c026d3',
      'undergraduate': '#2563eb',
      'other': '#64748b'
    };
    return colors[type] || '#64748b';
  };

  return (
    <div className="page-container">
      <div className="content-card">
        <div className="section-header">
          <div className="section-header__content">
            <div className="section-header__title-section">
              <p className="section-header__subtitle">Manage qualifications and their details</p>
            </div>
            <button 
              className="btn btn--primary"
              onClick={handleAddQualification}
            >
              <Plus size={16} />
              <span>Add Qualification</span>
            </button>
          </div>
        </div>

        <SearchForm
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />

        <div className="table-container">
          <table className="table">
            <thead className="table__header">
              <tr>
                <th>QUALIFICATION</th>
                <th>TYPE</th>
                <th>SPECIALIZATION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table__body">
              {qualifications.map((qualification) => (
                <tr key={qualification._id} className="table__row">
                  <td>
                    <div className="data-info">
                      <span className="data-info__title">{qualification.course}</span>
                      <span className="data-info__description">ID: {qualification._id}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="tag tag--primary"
                      style={{ 
                        backgroundColor: getQualificationTypeColor(qualification.qualificationType),
                        borderColor: getQualificationTypeColor(qualification.qualificationType)
                      }}
                    >
                      <GraduationCap size={12} />
                      {qualification.qualificationType.charAt(0).toUpperCase() + qualification.qualificationType.slice(1)}
                    </span>
                  </td>
                  <td className="text-secondary font-medium">
                    {qualification.specialization}
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn btn--icon btn--icon--view"
                        onClick={() => handleViewQualification(qualification._id)}
                        title="View qualification"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn--icon btn--icon--edit"
                        onClick={() => handleEditQualification(qualification._id)}
                        title="Edit qualification"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn--icon btn--icon--delete"
                        onClick={() => handleDeleteQualification(qualification._id)}
                        title="Delete qualification"
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

      <CreateQualificationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        qualificationData={selectedQualification}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal-container">
            <div className="delete-modal-header">
              <h2 className="delete-modal-title">Delete Qualification</h2>
            </div>
            <div className="delete-modal-content">
              <div className="delete-warning">
                <Trash2 size={48} className="delete-icon" />
                <h3>Are you sure you want to delete this qualification?</h3>
                <p>
                  You are about to delete the qualification <strong>"{qualificationToDelete?.course}"</strong>. 
                  This action cannot be undone and will permanently remove the qualification.
                  
                </p>
                <div className="qualification-details">
                  <div className="qualification-detail">
                    <span className="detail-label">Course:</span>
                    <span className="detail-value">{qualificationToDelete?.course}</span>
                  </div>
                  <div className="qualification-detail">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{qualificationToDelete?.qualificationType}</span>
                  </div>
                  <div className="qualification-detail">
                    <span className="detail-label">Specialization:</span>
                    <span className="detail-value">{qualificationToDelete?.specialization}</span>
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
                    <span>Delete Qualification</span>
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

export default Qualifications;