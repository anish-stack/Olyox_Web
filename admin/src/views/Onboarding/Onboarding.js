import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react';
import { FaEdit } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Onboarding = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedSlideId, setSelectedSlideId] = useState(null);
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:3100/api/v1/admin/get_onboarding_slides');

            // Ensure slides is always an array
            setSlides(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Error fetching slides:', error);
            toast.error('Failed to load onboarding slides. Please try again.');
            setSlides([]); // Ensure slides is an empty array on failure
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteSlide = async () => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:3100/api/v1/admin/delete_onboarding_slide/${selectedSlideId}`);
            toast.success('Slide deleted successfully!');
            fetchSlides();
            setDeleteModal(false);
        } catch (error) {
            console.error('Error deleting slide:', error);
            toast.error('Failed to delete slide. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = slides.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(slides.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    };

    const heading = ['S.No', 'Title', 'Image', 'Description', 'Slug', 'Actions'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : slides.length === 0 ? (
                <div className="no-data">
                    <p>No data available</p>
                </div>
            ) : (
                <Table
                    heading="Onboarding Slides"
                    btnText="Add Onboarding Slide"
                    btnURL="/onboarding/add-onboarding"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((item, index) => (
                            <CTableRow key={item._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{item.title}</CTableDataCell>
                                <CTableDataCell>
                                    <img src={item.imageUrl.image} alt={item.title} width={50} height={50} />
                                </CTableDataCell>
                                <CTableDataCell>{truncateText(item.description, 6)}</CTableDataCell>
                                <CTableDataCell>{truncateText(item.slug, 6)}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="primary"
                                        size="sm"
                                        onClick={() => navigate(`/onboarding/edit-onboarding/${item._id}`)}
                                    >
                                        <FaEdit />
                                    </CButton>{' '}
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedSlideId(item._id);
                                            setDeleteModal(true);
                                        }}
                                    >
                                        Delete
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    }
                    pagination={
                        <CPagination className="justify-content-center">
                            <CPaginationItem
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </CPaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <CPaginationItem
                                    key={index}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </CPaginationItem>
                            ))}
                            <CPaginationItem
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </CPaginationItem>
                        </CPagination>
                    }
                />
            )}

            <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
                <CModalHeader>
                    <CModalTitle>Delete Slide</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure you want to delete this slide?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDeleteModal(false)}>
                        Close
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteSlide}>
                        Delete
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Onboarding;
