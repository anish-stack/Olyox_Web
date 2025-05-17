import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wallet,
  BanknoteIcon,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee
} from 'lucide-react';

const Withdrawals = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])
  const SessionData = sessionStorage.getItem('user');
  const Provider = JSON.parse(SessionData);
  const providerId = Provider._id;
  const [showModal, setShowModal] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [ServerErrors, setServerErrors] = useState('');
  const [commission, setCommission] = useState({
    tdsPercentage: '',
    withdrawCommision: ''
  });

  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    isBank: false,
    isUpi: true,
    BankDetails: {
      accountNo: '',
      ifsc_code: '',
      bankName: '',
    },
    upi_details: {
      upi_id: '',
    },
  });

  useEffect(() => {
    if (providerId) {
      fetchWithdrawals();
    }
  }, [providerId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (formData.isBank) {
      if (!formData.BankDetails.accountNo || !/^\d{9,18}$/.test(formData.BankDetails.accountNo)) {
        newErrors.accountNo = 'Please enter a valid account number (9-18 digits)';
      }
      if (!formData.BankDetails.ifsc_code || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.BankDetails.ifsc_code)) {
        newErrors.ifsc_code = 'Please enter a valid IFSC code';
      }
      if (!formData.BankDetails.bankName) {
        newErrors.bankName = 'Please enter bank name';
      }
    }

    if (formData.isUpi) {
      if (!formData.upi_details.upi_id || !/^[\w.-]+@[\w.-]+$/.test(formData.upi_details.upi_id)) {
        newErrors.upi_id = 'Please enter a valid UPI ID';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://webapi.olyox.com/api/v1/get_withdrawal_by_vendor_id/${providerId}`);
      setWithdrawals(response.data.withdrawal);
      console.log("response.data.withdrawal", response.data)

      // Set last used method and details if available
      if (response.data.withdrawal.length > 0) {
        const lastWithdrawal = response.data.withdrawal[0];
        const isBank = lastWithdrawal.method === 'Bank Transfer';
        setFormData(prev => ({
          ...prev,
          method: lastWithdrawal.method,
          isBank: isBank,
          isUpi: !isBank,
          BankDetails: isBank ? {
            accountNo: lastWithdrawal.BankDetails?.accountNo || '',
            ifsc_code: lastWithdrawal.BankDetails?.ifsc_code || '',
            bankName: lastWithdrawal.BankDetails?.bankName || '',
          } : prev.BankDetails,
          upi_details: !isBank ? {
            upi_id: lastWithdrawal.upi_details?.upi_id || '',
          } : prev.upi_details,
        }));
      }
    } catch (error) {
      console.log('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCommissionTDS = async () => {
    try {
      const { data } = await axios.get('https://webapi.olyox.com/api/v1/get_single_commission_tds/681fa157d45bee7fc60813cb');
      setCommission(data.data);
    } catch (error) {
      console.log("Internal server error", error);
    }
  }

  useEffect(() => {
    handleFetchCommissionTDS();
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name in formData.BankDetails) {
      setFormData(prev => ({
        ...prev,
        BankDetails: {
          ...prev.BankDetails,
          [name]: value
        }
      }));
    } else if (name === 'upi_id') {
      setFormData(prev => ({
        ...prev,
        upi_details: {
          ...prev.upi_details,
          upi_id: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      method: method === 'Bank' ? 'Bank Transfer' : 'UPI',
      isBank: method === 'Bank',
      isUpi: method === 'Upi',
    }));
    setErrors({});
  };

  // Calculate final amount after deductions
  const calculateFinalAmount = (amount) => {
    if (!amount || isNaN(amount)) return 0;
    
    const parsedAmount = parseFloat(amount);
    const tdsDeduction = parsedAmount * (commission.tdsPercentage / 100);
    const commissionDeduction = parseFloat(commission.withdrawCommision);
    
    return parsedAmount - tdsDeduction - commissionDeduction;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Calculate the amounts
      const enteredAmount = parseFloat(formData.amount);
      const finalAmount = calculateFinalAmount(enteredAmount);
      const tdsDeduction = enteredAmount * (commission.tdsPercentage / 100);
      const commissionDeduction = parseFloat(commission.withdrawCommision);
      
      // Create withdrawal request with the final amount as the actual withdrawal amount
      const withdrawalRequest = {
        ...formData,
        amount: finalAmount, // Set the actual withdrawal amount to the final amount (after deductions)
        originalAmount: enteredAmount, // Store the original amount for record-keeping
        deductions: {
          tds: tdsDeduction,
          commission: commissionDeduction
        }
      };

      await axios.post('https://webapi.olyox.com/api/v1/create-withdrawal', withdrawalRequest, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      
      setShowModal(false);
      fetchWithdrawals();
    } catch (error) {
      setServerErrors(error?.response?.data?.message || "An error occurred during withdrawal submission")
      console.error('Error creating withdrawal:', error?.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = withdrawals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wallet className="w-8 h-8 text-red-500" />
          Withdrawals
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Withdrawal
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-red-500">New Withdrawal Request</h2>
            {ServerErrors && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-center rounded-lg mb-4">
                <p>{ServerErrors}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <IndianRupee className="w-4 h-4" />
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.amount ? 'border-red-500' : ''}`}
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Deduction Information */}
              {(commission.tdsPercentage > 0 || commission.withdrawCommision > 0) && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <h3 className="font-medium flex items-center gap-2 text-blue-700">
                    <AlertCircle className="w-5 h-5" />
                    Applicable Charges
                  </h3>
                  <div className="space-y-1 text-sm">
                    {commission.tdsPercentage > 0 && (
                      <div className="flex justify-between">
                        <span>TDS ({commission.tdsPercentage}%):</span>
                        <span>-₹{formData.amount ? (formData.amount * commission.tdsPercentage / 100).toFixed(2) : '0.00'}</span>
                      </div>
                    )}
                    {commission.withdrawCommision > 0 && (
                      <div className="flex justify-between">
                        <span>Service Charge:</span>
                        <span>-₹{commission.withdrawCommision.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 font-medium border-t border-blue-200 mt-2">
                      <span>You will receive:</span>
                      <span>₹{formData.amount ? calculateFinalAmount(formData.amount).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleMethodChange('Upi')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${formData.isUpi
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  <QrCode className="w-5 h-5" />
                  UPI
                </button>
                <button
                  type="button"
                  onClick={() => handleMethodChange('Bank')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${formData.isBank
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  <BanknoteIcon className="w-5 h-5" />
                  Bank
                </button>
              </div>

              {formData.isBank && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="accountNo"
                      placeholder="Account Number"
                      value={formData.BankDetails.accountNo}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${errors.accountNo ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.accountNo && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.accountNo}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="ifsc_code"
                      placeholder="IFSC Code"
                      value={formData.BankDetails.ifsc_code}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${errors.ifsc_code ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.ifsc_code && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.ifsc_code}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="bankName"
                      placeholder="Bank Name"
                      value={formData.BankDetails.bankName}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg ${errors.bankName ? 'border-red-500' : ''}`}
                      required
                    />
                    {errors.bankName && (
                      <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.bankName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {formData.isUpi && (
                <div>
                  <input
                    type="text"
                    name="upi_id"
                    placeholder="UPI ID"
                    value={formData.upi_details.upi_id}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg ${errors.upi_id ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.upi_id && (
                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.upi_id}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Submit Withdrawal
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawals Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    S. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Remark
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Method / Bank Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((withdrawal, index) => (
                  <tr key={withdrawal._id} className="hover:bg-red-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(withdrawal.requestedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.remark || "No Remark Yet"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>₹{withdrawal.amount}</span>
                        {withdrawal.originalAmount && withdrawal.originalAmount !== withdrawal.amount && (
                          <span className="text-xs text-gray-500">
                            Requested: ₹{withdrawal.originalAmount} (After deductions: ₹{withdrawal.amount})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {withdrawal.method === 'Bank Transfer' ? (
                            <BanknoteIcon className="w-4 h-4" />
                          ) : (
                            <QrCode className="w-4 h-4" />
                          )}
                          {withdrawal.method}
                        </div>

                        {/* Bank Details if method is Bank Transfer */}
                        {withdrawal.method === 'UPI' && withdrawal.upi_details && (
                          <div className="ml-6 text-xs text-gray-600 flex flex-col">
                            <span><strong>UPI:</strong> {withdrawal.upi_details.upi_id}</span>
                            {/* <span><strong>Account No:</strong> {withdrawal.BankDetails.accountNo}</span>
                            <span><strong>IFSC:</strong> {withdrawal.BankDetails.ifsc_code}</span> */}
                          </div>
                        )}

                        {/* Bank Details if method is Bank Transfer */}
                        {withdrawal.method === 'Bank Transfer' && withdrawal.BankDetails && (
                          <div className="ml-6 text-xs text-gray-600 flex flex-col">
                            <span><strong>Bank:</strong> {withdrawal.BankDetails.bankName}</span>
                            <span><strong>Account No:</strong> {withdrawal.BankDetails.accountNo}</span>
                            <span><strong>IFSC:</strong> {withdrawal.BankDetails.ifsc_code}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${getStatusColor(withdrawal.status)}`}>
                        {getStatusIcon(withdrawal.status)}
                        {withdrawal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-100 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-100 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Withdrawals;