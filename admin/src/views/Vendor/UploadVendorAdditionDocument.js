import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const UploadVendorAdditionDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    existingDocuments: {
      additionalDocImageOne: 'https://placehold.co/600x400?text=Aadhaar+Front',
      additionalDocImageTwo: 'https://placehold.co/600x400?text=Aadhaar+Back',
    },
    files: {
      additionalDocImageOne: null,
      additionalDocImageTwo: null,
    },
  });

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/get_Single_Provider/${id}`);
        setFormData((prev) => ({
          ...prev,
          existingDocuments: {
            additionalDocImageOne: data.data?.additionalDocImageOne?.image || prev.existingDocuments.additionalDocImageOne,
            additionalDocImageTwo: data.data?.additionalDocImageTwo?.image || prev.existingDocuments.additionalDocImageTwo,
          },
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to fetch vendor data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      files: { ...prev.files, [name]: files[0] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    ['additionalDocImageOne', 'additionalDocImageTwo'].forEach((key) => {
      if (formData.files[key]) {
        formDataToSend.append(key, formData.files[key]);
      }
    });

    setLoading(true);
    try {
      const res = await axios.put(
        `https://www.webapi.olyox.com/api/v1/update_addition_document/${id}`,
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      toast.success(res.data.message);
      // navigate('/vendor/all_vendor');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Update Vendor Documents"
      btnText="Back"
      btnURL="/vendor/all_vendor"
      onSubmit={handleSubmit}
      formContent={
        <>
          {[
            { key: 'additionalDocImageOne', label: 'Additional Document One' },
            { key: 'additionalDocImageTwo', label: 'Additional Document Two' },
          ].map(({ key, label }) => (
            <CCol md={12} className="mt-3" key={key}>
              <CFormLabel>{label}</CFormLabel>
              {formData.existingDocuments[key] && (
                <img
                  src={formData.existingDocuments[key]}
                  alt={`${label} preview`}
                  style={{ width: '150px', height: 'auto', display: 'block', marginBottom: '10px' }}
                />
              )}
              <CFormInput type="file" id={key} name={key} onChange={handleFileChange} />
            </CCol>
          ))}

          <CCol md={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Documents'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default UploadVendorAdditionDocument;
