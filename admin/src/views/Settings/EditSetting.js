import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormSwitch } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditSetting = () => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/admin/get_Setting');
                const filteredData = Object.fromEntries(
                    Object.entries(data).filter(([key]) =>
                        !['__v', 'updatedAt', 'createdAt', '_id'].includes(key)
                    )
                );
                setFormData(filteredData);
            } catch (error) {
                toast.error('Failed to load settings. Please try again.');
            }

        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleUpdateSetting = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://www.appapi.olyox.com/api/v1/admin/updateSetting', formData);
            toast.success('Settings updated successfully!');
            // navigate('/settings');
        } catch (error) {
            toast.error('Failed to update settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Edit Settings"
            btnText="Back"
            btnURL="/settings"
            onSubmit={handleUpdateSetting}
            formContent={
                <>
                    {Object.keys(formData).map((key) => (
                        <CCol md={12} key={key} className="mb-3">
                            <CFormLabel htmlFor={key}>
                                {key === 'twitterUrl' ? 'YouTube Url' : key.replace(/([A-Z])/g, ' $1').trim()}
                            </CFormLabel>

                            {typeof formData[key] === 'boolean' ? (
                                <CFormSwitch id={key} name={key} checked={formData[key]} onChange={handleChange} />
                            ) : (
                                <CFormInput id={key} name={key} value={formData[key]} onChange={handleChange} />
                            )}
                        </CCol>
                    ))}
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

export default EditSetting;
