import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditTiffinSubscription = () => {
    const { id } = useParams(); // Get the ID from the URL
    // const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        validityDays: '',
        HowManyMoneyEarnThisPlan: '',
        level: '',
        includes: '',
        whatIsThis: '',
        active: true,
        category: 'tiffin'
    });

    // Fetch the membership plan details when the component mounts
    useEffect(() => {
        const fetchMembershipPlan = async () => {
            try {

                const res = await axios.get(`https://www.webapi.olyox.com/api/v1/membership-plans/${id}`);
                setFormData({
                    title: res.data.data.title,
                    price: res.data.data.price,
                    description: res.data.data.description,
                    validityDays: res.data.data.validityDays,
                    HowManyMoneyEarnThisPlan: res.data.data.HowManyMoneyEarnThisPlan,
                    level: res.data.data.level,
                    includes: res.data.data.includes.join(', '), // Join the array into a comma-separated string
                    whatIsThis: res.data.data.whatIsThis,
                    active: res.data.data.active,
                    category: res.data.data.category,
                });
            } catch (error) {
                console.error('Error fetching membership plan:', error);
                toast.error('Failed to fetch membership plan.');
            }
        };

        fetchMembershipPlan();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Submit the updated form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure `includes` is an array of strings (split by commas)
        const includesArray = formData.includes.split(',').map(item => item.trim());

        const formDataToSend = { ...formData, includes: includesArray };

        setLoading(true);
        try {
            const res = await axios.put(`https://www.webapi.olyox.com/api/v1/membership-plans/${id}`, formDataToSend);
            toast.success(res.data.message);
            // history.push('/membership-plans'); // Redirect to the membership plans list page
        } catch (error) {
            console.error('Error submitting updated membership plan:', error);
            toast.error(error?.response?.data?.message || 'Failed to update membership plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Edit Tiffin Plan"
            btnText="Back"
            btnURL="/subscription/all_tiffin"
            onSubmit={handleSubmit}
            formContent={
                <>
                    <CCol md={12}>
                        <CFormLabel htmlFor="title">Title</CFormLabel>
                        <CFormInput
                            id="title"
                            name="title"
                            placeholder="Enter Membership Plan title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="price">Price</CFormLabel>
                        <CFormInput
                            id="price"
                            name="price"
                            type="number"
                            placeholder="Enter Membership Plan price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="description">Description</CFormLabel>
                        <CFormTextarea
                            id="description"
                            name="description"
                            placeholder="Enter Membership Plan description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="validityDays">Validity Of Plan</CFormLabel>
                        <CFormInput
                            id="validityDays"
                            name="validityDays"
                            type="number"
                            placeholder="Enter validity in days"
                            value={formData.validityDays}
                            onChange={handleChange}
                        />
                    </CCol>
                                        <CCol md={12} className="mt-3">
                                            <CFormLabel htmlFor="HowManyMoneyEarnThisPlan">Enter Money to be Earned</CFormLabel>
                                            <CFormInput
                                                id="HowManyMoneyEarnThisPlan"
                                                name="HowManyMoneyEarnThisPlan"
                                                type="number"
                                                placeholder="Enter Money to be Earned"
                                                value={formData.HowManyMoneyEarnThisPlan}
                                                onChange={handleChange}
                                            />
                                        </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="whatIsThis">What is This (day,week,Month,year)</CFormLabel>
                        <CFormSelect
                            id="whatIsThis"
                            name="whatIsThis"
                            value={formData.whatIsThis}
                            onChange={(e) => setFormData({ ...formData, whatIsThis: e.target.value })}
                        >
                            <option value="">Select</option>
                            <option value="Day">Day</option>
                            <option value="Week">Week</option>
                            <option value="Month">Month</option>
                            <option value="Year">Year</option>

                        </CFormSelect>
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="includes">Includes(use comma to separate)</CFormLabel>
                        <CFormTextarea
                            id="includes"
                            name="includes"
                            placeholder="Enter included features"
                            value={formData.includes}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="Level">Level</CFormLabel>
                        <CFormTextarea
                            id="level"
                            name="level"
                            placeholder="Enter level of the plan"
                            value={formData.level}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol xs={12} className="mt-4">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Please Wait...' : 'Submit'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
}

export default EditTiffinSubscription
