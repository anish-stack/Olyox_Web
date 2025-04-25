import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CFormSwitch,
    CButton,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://www.appapi.olyox.com/api/v1/admin/get_Setting');
            console.log("data.data", data)
            setSettings(data || {});
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const currentData = settings.slice(startIndex, startIndex + itemsPerPage);
    // const totalPages = Math.ceil(settings.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = [
        'App Name', 'App URL', 'Admin Email', 'Maintenance Mode', 'Basic Fare', 'Fare Per Km',
        'Rain Mode', 'Rain Fare Per 3Km', 'Show Rain On App', 'Show Offers', 'OpenMap API Key',
        'Google API Key', 'Traffic Price Per Min', 'Waiting Time', 'Created At', 'Updated At'
    ];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="Application Settings"
                    tableHeading={heading}
                    tableContent={
                        <CTableRow>
                            {/* <CTableDataCell>{1}</CTableDataCell> */}
                            <CTableDataCell>{settings.appName}</CTableDataCell>
                            <CTableDataCell>{settings.appUrl}</CTableDataCell>
                            <CTableDataCell>{settings.adminEmail}</CTableDataCell>
                            <CTableDataCell>
                                <CFormSwitch id={`switch-${settings._id}`} checked={settings.maintenanceMode} disabled />
                            </CTableDataCell>
                            <CTableDataCell>{settings.BasicFare}</CTableDataCell>
                            <CTableDataCell>{settings.BasicFarePerKm}</CTableDataCell>
                            <CTableDataCell>
                                <CFormSwitch id={`rain-${settings._id}`} checked={settings.RainModeOn} disabled />
                            </CTableDataCell>
                            <CTableDataCell>{settings.RainModeFareOnEveryThreeKm}</CTableDataCell>
                            <CTableDataCell>
                                <CFormSwitch id={`show-rain-${settings._id}`} checked={settings.ShowingRainOnApp} disabled />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSwitch id={`show-offers-${settings._id}`} checked={settings.ShowingOfferScreenOnApp} disabled />
                            </CTableDataCell>
                            <CTableDataCell>{settings.openMapApiKey}</CTableDataCell>
                            <CTableDataCell>{settings.googleApiKey}</CTableDataCell>
                            <CTableDataCell>{settings.trafficDurationPricePerMinute}</CTableDataCell>
                            <CTableDataCell>{settings.waitingTimeInMinutes}</CTableDataCell>
                            <CTableDataCell>{new Date(settings.createdAt).toLocaleString()}</CTableDataCell>
                            <CTableDataCell>{new Date(settings.updatedAt).toLocaleString()}</CTableDataCell>
                        </CTableRow>
                    }
                    // pagination={
                    //     <CPagination className="justify-content-center">
                    //         <CPaginationItem
                    //             disabled={currentPage === 1}
                    //             onClick={() => handlePageChange(currentPage - 1)}
                    //         >
                    //             Previous
                    //         </CPaginationItem>
                    //         {Array.from({ length: totalPages }, (_, index) => (
                    //             <CPaginationItem
                    //                 key={index}
                    //                 active={index + 1 === currentPage}
                    //                 onClick={() => handlePageChange(index + 1)}
                    //             >
                    //                 {index + 1}
                    //             </CPaginationItem>
                    //         ))}
                    //         <CPaginationItem
                    //             disabled={currentPage === totalPages}
                    //             onClick={() => handlePageChange(currentPage + 1)}
                    //         >
                    //             Next
                    //         </CPaginationItem>
                    //     </CPagination>
                    // }
                />
            )}
        </>
    );
}

export default Settings;