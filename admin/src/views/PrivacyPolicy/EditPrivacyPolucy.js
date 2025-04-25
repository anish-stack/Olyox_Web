import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import JoditEditor from 'jodit-react';

const EditPrivacyPolicy = () => {
  const editor = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleContentChange = (newContent) => {
  //   setFormData((prev) => ({ ...prev, content: newContent }));
  // };

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://www.appapi.olyox.com/api/v1/admin/policy/${id}`);
      const { title, description, content, category } = data;
      setFormData({ title, description, content, category });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load policy details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, content, category } = formData;

    if (!title || !description || !content || !category) {
      toast.error('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`http://www.appapi.olyox.com/api/v1/admin/policy/${id}`, formData);
      toast.success(res.data.message || 'Policy updated successfully.');
      navigate('/all-privacy-policy');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update the policy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  return (
    <Form
      heading="Edit Privacy Policy"
      btnText="Back"
      btnURL="/all-privacy-policy"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
              id="title"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel>Content</CFormLabel>
            <JoditEditor
             ref={editor}
              value={formData.content}
              // onChange={handleContentChange}
              config={{ height: 400 }}
              tabIndex={1}
              onBlur={(newContent) =>
                setFormData((prevData) => ({
                    ...prevData,
                    content: newContent,
                }))
            }
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="category">Category</CFormLabel>
            <CFormInput
              id="category"
              name="category"
              placeholder='e.g., "Privacy", "Terms of Service", "Refund Policy"'
              value={formData.category}
              onChange={handleChange}
            />
          </CCol>
          <CCol xs={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Please Wait...' : 'Update'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default EditPrivacyPolicy;
