import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormSwitch } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditTDSCommission = () => {
  const id = '681fa157d45bee7fc60813cb'; // Ideally this should come from useParams
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tdsPercentage: '',
    withdrawCommision: '',
    isActive: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const fetchCommissionTDS = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/get_single_commission_tds/681fa157d45bee7fc60813cb`);
      const { tdsPercentage, withdrawCommision, isActive } = data.data;
      setFormData({ tdsPercentage, withdrawCommision, isActive });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load Commission TDS details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { tdsPercentage, withdrawCommision } = formData;

    if (tdsPercentage === '' || withdrawCommision === '') {
      toast.error('All fields are required.');
      return;
    }
    console.log("formdata", tdsPercentage, withdrawCommision);

    setLoading(true);
    try {
      const res = await axios.put(`https://www.webapi.olyox.com/api/v1/update_commission_tds/681fa157d45bee7fc60813cb`, formData);
      toast.success(res.data.message || 'Commission TDS updated successfully.');
    //   navigate('/all-tds-commission');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update Commission TDS.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionTDS();
  }, []);

  return (
    <Form
      heading="Edit Commission TDS"
      btnText=""
      btnURL=""
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="tdsPercentage">TDS Percentage (%)</CFormLabel>
            <CFormInput
              type="number"
              id="tdsPercentage"
              name="tdsPercentage"
              placeholder="Enter TDS Percentage"
              value={formData.tdsPercentage}
              onChange={handleChange}
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="withdrawCommision">Withdraw Commission</CFormLabel>
            <CFormInput
              type="number"
              id="withdrawCommision"
              name="withdrawCommision"
              placeholder="Enter Withdraw Commission"
              value={formData.withdrawCommision}
              onChange={handleChange}
            />
          </CCol>

          <CCol md={12} className="mt-4">
            <CFormLabel htmlFor="isActive">Is Active</CFormLabel>
            <CFormSwitch
              id="isActive"
              name="isActive"
              label={formData.isActive ? 'Active' : 'Inactive'}
              checked={formData.isActive}
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

export default EditTDSCommission;
