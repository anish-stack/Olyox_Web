import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Brands = () => {
  const { id } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [editOld, setEditOld] = useState('');
  const [editNew, setEditNew] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const BASE_URL = 'https://www.appapi.olyox.com/api/v1/admin';

  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Fetch subcategories on mount
  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/ride-sub-suggestion/by-category/${id}`);
      const data = response.data?.data[0]?.subCategory || [];
      setSubCategories(data);
    } catch (error) {
      console.error('Fetch error:', error);
      showAlert('danger', 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [id]);

  // Add subcategory
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSubCategory.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/ride-sub-suggestion/${id}`, {
        subCategory: newSubCategory.trim(),
      });

      showAlert('success', 'Brand added successfully');
      setNewSubCategory('');
      fetchSubCategories();
    } catch (error) {
      console.error('Add error:', error);
      showAlert('danger', 'Failed to add brand');
    } finally {
      setSubmitting(false);
    }
  };

  // Update subcategory
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editOld || !editNew.trim()) return;

    setSubmitting(true);
    try {
      await axios.put(`${BASE_URL}/ride-sub-suggestion/${id}`, {
        oldValue: editOld,
        newValue: editNew.trim(),
      });
      
      showAlert('success', 'Brand updated successfully');
      setEditOld('');
      setEditNew('');
      fetchSubCategories();
    } catch (error) {
      console.error('Update error:', error);
      showAlert('danger', 'Failed to update brand');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete subcategory
  const handleDelete = async (itemToDelete) => {
    if (!window.confirm(`Are you sure you want to delete "${itemToDelete}"?`)) return;
    
    setSubmitting(true);
    try {
      await axios.delete(`${BASE_URL}/ride-sub-suggestion/${id}`, {
        data: { subCategoryToDelete: itemToDelete },
      });
      
      showAlert('success', 'Brand deleted successfully');
      fetchSubCategories();
    } catch (error) {
      console.error('Delete error:', error);
      showAlert('danger', 'Failed to delete brand');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Brand Management</h4>
            </div>
            <div className="card-body">
              {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                  {alert.message}
                  <button type="button" className="btn-close" onClick={() => setAlert({ show: false })}></button>
                </div>
              )}
              
              <div className="row mb-4">
                <div className="col-lg-6">
                  {/* Add Form */}
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Add New Brand</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleAdd}>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter brand name"
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            disabled={submitting}
                            required
                          />
                          <button 
                            type="submit" 
                            className="btn btn-success" 
                            disabled={submitting || !newSubCategory.trim()}
                          >
                            {submitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Adding...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-plus-circle me-1"></i> Add
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6">
                  {/* Update Form */}
                  <div className="card">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Update Brand</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleUpdate}>
                        <div className="mb-3">
                          <select
                            className="form-select"
                            value={editOld}
                            onChange={(e) => setEditOld(e.target.value)}
                            disabled={submitting || loading}
                            required
                          >
                            <option value="">Select brand to edit</option>
                            {subCategories.map((item, idx) => (
                              <option key={idx} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="New name"
                            value={editNew}
                            onChange={(e) => setEditNew(e.target.value)}
                            disabled={submitting || !editOld}
                            required
                          />
                          <button 
                            type="submit" 
                            className="btn btn-warning" 
                            disabled={submitting || !editOld || !editNew.trim()}
                          >
                            {submitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-pencil-square me-1"></i> Update
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Brands List */}
              <div className="card">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Brand List</h5>
                  <span className="badge bg-primary rounded-pill">{subCategories.length} Brands</span>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-3">Loading brands...</div>
                    </div>
                  ) : subCategories.length === 0 ? (
                    <div className="alert alert-info mb-0">
                      No brands found. Add your first brand above.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-striped">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Brand Name</th>
                            <th scope="col" className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subCategories.map((item, idx) => (
                            <tr key={idx}>
                              <th scope="row">{idx + 1}</th>
                              <td>{item}</td>
                              <td className="text-end">
                                <button 
                                  className="btn btn-sm btn-outline-warning me-2" 
                                  onClick={() => {
                                    setEditOld(item);
                                    setEditNew(item);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  disabled={submitting}
                                >
                                  <i className="bi bi-pencil"></i> Edit
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger" 
                                  onClick={() => handleDelete(item)}
                                  disabled={submitting}
                                >
                                  <i className="bi bi-trash"></i> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;