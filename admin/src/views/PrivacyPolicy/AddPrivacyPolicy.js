import React, { useState, useRef } from 'react';
import {
    CCol,
    CFormInput,
    CFormLabel,
    CButton,
    CFormTextarea,
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import JoditEditor from 'jodit-react';

const AddPrivacyPolicy = () => {
    const editor = useRef(null);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        category: '',
    });

    // Handle text inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, description, content, category } = formData;

        // Validation
        if (!title || !description || !content || !category) {
            toast.error('All fields are required.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('https://www.appapi.olyox.com/api/v1/admin/policy', {
                title,
                description,
                content,
                category,
            });

            toast.success(res.data.message || 'Privacy Policy added successfully');

            // Reset form
            setFormData({
                title: '',
                description: '',
                content: '',
                category: '',
            });
        } catch (error) {
            console.error('Error adding policy:', error);
            toast.error(error?.response?.data?.message || 'Failed to create policy. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Add Privacy Policy"
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
                        <CFormLabel htmlFor="category">Category</CFormLabel>
                        <CFormInput
                            id="category"
                            name="category"
                            placeholder="Enter category (e.g., Privacy, Terms of Service)"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="description">Short Description</CFormLabel>
                        <CFormTextarea
                            id="description"
                            name="description"
                            rows={3}
                            placeholder="Enter short description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="content">Full Content</CFormLabel>
                        <JoditEditor
                            ref={editor}
                            value={formData.content}
                            config={{
                                height: 300, // Set height in pixels (adjust as needed)
                            }}
                            tabIndex={1}
                            onBlur={(newContent) =>
                                setFormData((prevData) => ({
                                    ...prevData,
                                    content: newContent,
                                }))
                            }
                        />
                    </CCol>

                    <CCol xs={12} className="mt-4">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default AddPrivacyPolicy;
