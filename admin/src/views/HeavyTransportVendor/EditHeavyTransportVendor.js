import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormCheck, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditHeavyTransportVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    vehicle_info: [],
    service_areas: [],
    call_timing: {
      start_time: '',
      end_time: ''
    },
    status: 'Active',
    is_blocked: false,
    is_working: false,
    profile_shows_at_position: 1,
    existingImages: {
      profile_image: ''
    },
    files: {
      profile_image: null
    }
  });

  // Handle input changes for basic fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked
    }));
  };

  // Handle call timing changes
  const handleCallTimingChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      call_timing: {
        ...prevFormData.call_timing,
        [name]: value
      }
    }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        [name]: files[0]
      }
    }));
  };

  // Handle vehicle type selection
  const handleVehicleChange = (e) => {
    const { value } = e.target;
    const selectedVehicle = vehicleTypes.find(vehicle => vehicle._id === value);
    
    if (selectedVehicle && !formData.vehicle_info.some(v => v._id === selectedVehicle._id)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        vehicle_info: [...prevFormData.vehicle_info, selectedVehicle]
      }));
    }
  };

  // Remove vehicle from selection
  const handleRemoveVehicle = (vehicleId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vehicle_info: prevFormData.vehicle_info.filter(v => v._id !== vehicleId)
    }));
  };

  // Handle service area changes
  const handleServiceAreaChange = (index, field, value) => {
    setFormData((prevFormData) => {
      const updatedAreas = [...prevFormData.service_areas];
      if (field === 'coordinates') {
        // Parse coordinates from string to array of numbers
        const coords = value.split(',').map(coord => parseFloat(coord.trim()));
        updatedAreas[index].location.coordinates = coords;
      } else if (field === 'name') {
        updatedAreas[index].name = value;
      }
      return {
        ...prevFormData,
        service_areas: updatedAreas
      };
    });
  };

  // Add new service area
  const handleAddServiceArea = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      service_areas: [
        ...prevFormData.service_areas,
        {
          name: '',
          location: {
            type: 'Point',
            coordinates: [0, 0]
          }
        }
      ]
    }));
  };

  // Remove service area
  const handleRemoveServiceArea = (index) => {
    setFormData((prevFormData) => {
      const updatedAreas = [...prevFormData.service_areas];
      updatedAreas.splice(index, 1);
      return {
        ...prevFormData,
        service_areas: updatedAreas
      };
    });
  };

  // Fetch vehicle types
  const fetchVehicleTypes = async () => {
    try {
      const { data } = await axios.get('http://localhost:3100/api/v1/admin/vehicles');
      setVehicleTypes(data.data);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      toast.error('Failed to fetch vehicle types');
    }
  };

  // Fetch existing partner data
  const fetchPartnerData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:3100/api/v1/heavy/heavy-vehicle-profile/${id}`);
      const partnerData = data.data;
      
      setFormData({
        name: partnerData.name,
        email: partnerData.email,
        phone_number: partnerData.phone_number,
        vehicle_info: partnerData.vehicle_info || [],
        service_areas: partnerData.service_areas || [],
        call_timing: partnerData.call_timing || {
          start_time: '',
          end_time: ''
        },
        status: partnerData.status || 'Active',
        is_blocked: partnerData.is_blocked || false,
        is_working: partnerData.is_working || false,
        profile_shows_at_position: partnerData.profile_shows_at_position || 1,
        existingImages: {
          profile_image: partnerData.profile_image?.url || ''
        },
        files: {
          profile_image: null
        }
      });
    } catch (error) {
      console.error('Error fetching partner data:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch partner data');
    } finally {
      setLoading(false);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { 
      name, email, phone_number, vehicle_info, service_areas, 
      call_timing, status, is_blocked, is_working, profile_shows_at_position, files 
    } = formData;

    // Validate required fields
    if (!name || !email || !phone_number) {
      toast.error('Name, email, and phone number are required fields');
      return;
    }

    // Create FormData to send
    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('phone_number', phone_number);
    formDataToSend.append('vehicle_info', JSON.stringify(vehicle_info.map(v => v._id)));
    formDataToSend.append('service_areas', JSON.stringify(service_areas));
    formDataToSend.append('call_timing', JSON.stringify(call_timing));
    formDataToSend.append('status', status);
    formDataToSend.append('is_blocked', is_blocked);
    formDataToSend.append('is_working', is_working);
    formDataToSend.append('profile_shows_at_position', profile_shows_at_position);
    
    // Append profile image if present
    if (files.profile_image) {
      formDataToSend.append('profile_image', files.profile_image);
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:3100/api/v1/heavy/heavy-vehicle-profile-update/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(res.data.message);
      navigate('/heavy/all-heavy-transport-vendor');
    } catch (error) {
      console.error('Error updating partner details:', error);
      toast.error(error?.response?.data?.message || 'Failed to update partner details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleTypes();
    fetchPartnerData();
  }, [id]); // Fetch data when ID changes

  return (
    <Form
      heading="Edit Heavy Transport Partner"
      btnText="Back"
      btnURL="/heavy/all-heavy-transport-vendor"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="name">Partner Name</CFormLabel>
            <CFormInput
              id="name"
              name="name"
              placeholder="Enter partner name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </CCol>
          
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </CCol>
          
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="phone_number">Phone Number</CFormLabel>
            <CFormInput
              id="phone_number"
              name="phone_number"
              placeholder="Enter 10-digit phone number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </CCol>
          
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </CFormSelect>
          </CCol>
          
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="profile_shows_at_position">Profile Position</CFormLabel>
            <CFormInput
              id="profile_shows_at_position"
              name="profile_shows_at_position"
              type="number"
              min="1"
              placeholder="Enter profile position"
              value={formData.profile_shows_at_position}
              onChange={handleChange}
            />
          </CCol>
          
          <CCol md={12} className="mt-3">
            <CFormCheck
              id="is_blocked"
              name="is_blocked"
              label="Is Blocked"
              checked={formData.is_blocked}
              onChange={handleCheckboxChange}
            />
          </CCol>
          
          <CCol md={12} className="mt-3">
            <CFormCheck
              id="is_working"
              name="is_working"
              label="Is Currently Working"
              checked={formData.is_working}
              onChange={handleCheckboxChange}
            />
          </CCol>
          
          <CCol md={12} className="mt-4">
            <h5>Call Timing</h5>
            <div className="d-flex gap-3">
              <CCol md={6}>
                <CFormLabel htmlFor="start_time">Start Time</CFormLabel>
                <CFormInput
                  id="start_time"
                  name="start_time"
                  placeholder="e.g. 9:00 AM"
                  value={formData.call_timing.start_time}
                  onChange={handleCallTimingChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="end_time">End Time</CFormLabel>
                <CFormInput
                  id="end_time"
                  name="end_time"
                  placeholder="e.g. 6:00 PM"
                  value={formData.call_timing.end_time}
                  onChange={handleCallTimingChange}
                />
              </CCol>
            </div>
          </CCol>
          
          <CCol md={12} className="mt-4">
            <h5>Vehicle Types</h5>
            <div className="d-flex gap-3 mb-3">
              <CCol md={9}>
                <CFormSelect
                  id="vehicleSelect"
                  onChange={handleVehicleChange}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>{vehicle.name}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CButton color="secondary" type="button" onClick={handleAddServiceArea}>
                  Add Service Area
                </CButton>
              </CCol>
            </div>
            
            {formData.vehicle_info.length > 0 && (
              <div className="mt-2">
                <h6>Selected Vehicles:</h6>
                <ul className="list-group">
                  {formData.vehicle_info.map(vehicle => (
                    <li key={vehicle._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {vehicle.name}
                      <CButton color="danger" size="sm" onClick={() => handleRemoveVehicle(vehicle._id)}>
                        Remove
                      </CButton>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CCol>
          
          <CCol md={12} className="mt-4">
            <h5>Service Areas</h5>
            {formData.service_areas.map((area, index) => (
              <div key={index} className="border p-3 mb-3 rounded">
                <div className="d-flex justify-content-between mb-2">
                  <h6>Area {index + 1}</h6>
                  <CButton color="danger" size="sm" onClick={() => handleRemoveServiceArea(index)}>
                    Remove
                  </CButton>
                </div>
                <CCol md={12} className="mb-2">
                  <CFormLabel>Area Name</CFormLabel>
                  <CFormInput
                    value={area.name}
                    onChange={(e) => handleServiceAreaChange(index, 'name', e.target.value)}
                    placeholder="Enter area name"
                  />
                </CCol>
                <CCol md={12}>
                  <CFormLabel>Coordinates (longitude, latitude)</CFormLabel>
                  <CFormInput
                    value={area.location.coordinates.join(', ')}
                    onChange={(e) => handleServiceAreaChange(index, 'coordinates', e.target.value)}
                    placeholder="e.g. 77.2090, 28.6139"
                  />
                </CCol>
              </div>
            ))}
          </CCol>
          
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="profile_image">Profile Image</CFormLabel>
            <CFormInput
              type="file"
              id="profile_image"
              name="profile_image"
              onChange={handleFileChange}
            />
            {formData.existingImages.profile_image && (
              <div className="mt-2">
                <img
                  src={formData.existingImages.profile_image}
                  alt="Profile"
                  style={{ maxWidth: '200px', borderRadius: '8px' }}
                />
                <p className="text-muted">Current profile image</p>
              </div>
            )}
          </CCol>

          <CCol md={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Partner'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default EditHeavyTransportVendor;