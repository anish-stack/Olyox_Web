import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { toast, Toaster } from "react-hot-toast";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import ImageUploader from "./components/ImageUploader";
import LoadingSpinner from "./components/LoadingSpinner";

const Register = () => {
  const location = new URLSearchParams(window.location.search);
  const bh_id = location.get('bh_id') || null;
  const [isBhverify, setIsverify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reEmail: '',
    number: '',
    password: '',
    category: '',
    address: {
      area: '',
      street_address: 'Rohini',
      landmark: '',
      pincode: '',
      location: {
        type: 'Point',
        coordinates: [78.2693, 25.369]
      }
    },
    dob: null,
    aadharNumber: '',
    referral_code_which_applied: '',
    is_referral_applied: false,
    member_id: '',
    aadharfront: null,
    aadharback: null,
    pancard: null,
  });

  const [imagePreview, setImagePreview] = useState({
    aadharfront: null,
    aadharback: null,
    pancard: null
  });

  useEffect(() => {
    checkBhId();
    fetchCategory();
  }, []);

  useEffect(() => {
    if (bh_id) {
      setFormData((prev) => ({
        ...prev,
        referral_code_which_applied: bh_id,
        is_referral_applied: true
      }));
    }
  }, [bh_id]);

  // Validate form fields in real-time when they change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm(true);
    }
  }, [formData, touched]);

  const checkBhId = async () => {
    try {
      const { data } = await axios.post('https://webapi.olyox.com/api/v1/check-bh-id', { bh: bh_id });
      const status = data.success;
      if (status) {
        setIsverify(true);
      } else {
        setIsverify(false);
      }
    } catch (err) {
      console.log(err);
      setIsverify(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const { data } = await axios.get('https://webapi.olyox.com/api/v1/categories_get');
      setCategories(data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (touchedOnly = false) => {
    const newErrors = {};
    const currentDate = new Date();
    
    // Only validate fields that have been touched if touchedOnly is true
    const shouldValidate = (field) => !touchedOnly || touched[field];

    if (shouldValidate('name') && !formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (shouldValidate('dob')) {
      if (!formData.dob) {
        newErrors.dob = 'Please enter your date of birth';
      } else {
        const dobDate = new Date(formData.dob);
        const age = currentDate.getFullYear() - dobDate.getFullYear();
        const isBeforeBirthday = currentDate < new Date(dobDate.setFullYear(currentDate.getFullYear()));

        if (age < 18 || (age === 18 && isBeforeBirthday)) {
          newErrors.dob = 'You must be at least 18 years old';
        }
      }
    }

    if (shouldValidate('email')) {
      if (!formData.email.trim()) {
        newErrors.email = 'Please provide your email address';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (shouldValidate('reEmail')) {
      if (!formData.reEmail.trim()) {
        newErrors.reEmail = 'Please confirm your email address';
      } else if (formData.email.trim() && formData.email !== formData.reEmail) {
        newErrors.reEmail = 'Email addresses do not match';
      }
    }

    if (shouldValidate('number')) {
      if (!formData.number.trim()) {
        newErrors.number = 'Please enter your phone number';
      } else if (!/^\d{10}$/.test(formData.number)) {
        newErrors.number = 'Phone number must be exactly 10 digits';
      }
    }

    if (shouldValidate('password')) {
      if (!formData.password.trim()) {
        newErrors.password = 'Please create a password';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }
    }

    if (shouldValidate('category') && !formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (shouldValidate('address.pincode') && !formData.address.pincode.trim()) {
      newErrors.pincode = 'Please enter your area pincode';
    }

    if (shouldValidate('aadharNumber')) {
      const rawAadhaar = formData.aadharNumber.replace(/\s/g, '');
      if (!rawAadhaar) {
        newErrors.aadharNumber = 'Please enter your Aadhaar number';
      } else if (rawAadhaar.length !== 12) {
        newErrors.aadharNumber = 'Aadhaar must be exactly 12 digits';
      } else if (!/^\d{12}$/.test(rawAadhaar)) {
        newErrors.aadharNumber = 'Aadhaar must contain only digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    if (name === 'aadharNumber') {
      // Remove all non-digit characters
      const rawValue = value.replace(/\D/g, '');
      // Format: insert space after every 4 digits
      const formattedValue = rawValue.replace(/(.{4})/g, '$1 ').trim();

      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setTouched(prev => ({ ...prev, [`address.${addressField}`]: true }));
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (name, file, preview) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({ ...prev, [name]: file }));
    setImagePreview(prev => ({ ...prev, [name]: preview }));
  };

  const fetchAddressSuggestions = async (query) => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(`https://api.blueaceindia.com/api/v1/autocomplete?input=${encodeURIComponent(query)}`);
      setAddressSuggestions(res.data);
    } catch (err) {
      console.error('Error fetching address suggestions:', err);
    }
  };

  const fetchGeocode = async (selectedAddress) => {
    try {
      const res = await axios.get(`https://api.blueaceindia.com/api/v1/geocode?address=${encodeURIComponent(selectedAddress?.description)}`);
      const { latitude, longitude } = res.data;
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      }));
    } catch (err) {
      console.error('Error fetching geocode:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    const allFields = [
      'name', 'dob', 'email', 'reEmail', 'number', 'password', 
      'category', 'address.area', 'address.pincode', 'aadharNumber'
    ];
    
    const touchedFields = {};
    allFields.forEach(field => touchedFields[field] = true);
    setTouched(touchedFields);
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setSubmitting(true);
    const updatedData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'address') {
        Object.entries(value).forEach(([addressKey, addressValue]) => {
          if (addressKey === 'location') {
            updatedData.append(`address[${addressKey}][type]`, addressValue.type);
            updatedData.append(`address[${addressKey}][coordinates]`, JSON.stringify(addressValue.coordinates));
          } else {
            updatedData.append(`address[${addressKey}]`, addressValue);
          }
        });
      } else if (key === 'aadharfront' || key === 'aadharback' || key === 'pancard') {
        if (value) {
          updatedData.append(key, value);
        }
      } else {
        updatedData.append(key, value);
      }
    });

    try {
      const response = await axios.post('https://webapi.olyox.com/api/v1/register_vendor', updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(response.data.message || 'Registration successful');
      if (response.data?.success) {
        window.location.href = `/otp-verify?type=${response.data?.type}&email=${response?.data?.email}&expireTime=${response?.data?.time}&number=${response?.data?.number}`;
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isBhverify) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Verification Failed
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The BH ID you provided is either not active or unavailable. Please contact support for assistance.
          </p>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/support'}
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
   
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Vendor Registration</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 px-6 pt-4 pb-6 rounded-lg">
            <h4 className="text-xl text-gray-900 font-bold mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Name as Per Aadhaar Card"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              
              <InputField
                label="Date of Birth"
                id="dob"
                name="dob"
                type="date"
                value={formData.dob || ''}
                onChange={handleChange}
                error={errors.dob}
              />
              
              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              
              <InputField
                label="Re-Enter Email"
                id="reEmail"
                name="reEmail"
                type="email"
                value={formData.reEmail}
                onChange={handleChange}
                error={errors.reEmail}
              />
              
              <InputField
                label="Phone Number"
                id="number"
                name="number"
                type="tel"
                value={formData.number}
                onChange={handleChange}
                error={errors.number}
              />
              
              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-50 px-6 pt-4 pb-6 rounded-lg">
            <h4 className="text-xl text-gray-900 font-bold mb-4">Address Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Address (as per aadhar card)"
                id="address.area"
                name="address.area"
                type="text"
                value={formData.address.area}
                onChange={handleChange}
              />
              
              <InputField
                label="Aadhaar Number"
                id="aadharNumber"
                name="aadharNumber"
                type="text"
                value={formData.aadharNumber}
                onChange={handleChange}
                error={errors.aadharNumber}
              />
              
              <InputField
                label="Landmark"
                id="address.landmark"
                name="address.landmark"
                type="text"
                value={formData.address.landmark}
                onChange={handleChange}
              />
              
              <InputField
                label="Pincode"
                id="address.pincode"
                name="address.pincode"
                type="text"
                value={formData.address.pincode}
                onChange={handleChange}
                error={errors.pincode}
              />
            </div>
          </div>

          {/* Other Details Section */}
          <div className="bg-gray-50 px-6 pt-4 pb-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Other Important Details</h4>
            
            <div className="mb-6">
              <SelectField
                label="Category"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleSelect}
                error={errors.category}
                options={categories.map(category => ({
                  value: category._id,
                  label: category.title
                }))}
                placeholder="Select a category"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                label="Aadhaar Front"
                id="aadharfront"
                
                name="aadharfront"
                onImageSelected={(file, preview) => handleFileUpload('aadharfront', file, preview)}
                preview={imagePreview.aadharfront}
              />
              
              <ImageUploader
                label="Aadhaar Back"
                id="aadharback"
                name="aadharback"
                onImageSelected={(file, preview) => handleFileUpload('aadharback', file, preview)}
                preview={imagePreview.aadharback}
              />
              
              <ImageUploader
                label="Pan Card"
                id="pancard"
                name="pancard"
                onImageSelected={(file, preview) => handleFileUpload('pancard', file, preview)}
                preview={imagePreview.pancard}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <span className="mr-2">Registering...</span>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                </>
              ) : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
