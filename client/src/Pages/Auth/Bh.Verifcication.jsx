import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const BhVerification = () => {
  const [bh, setBh] = useState('');
  const [name, setName] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBhId = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('https://apiking.digital4now.in/api/v1/check-bh-id', { bh });

      if (!data.success) {
        setLoading(false);
        return setError(data.message || 'Failed to validate BH ID.');
      }

      setName(data.data);
      setResponse(data);

      setTimeout(() => {
        window.location.href = `/register?bh_id=${bh}`;
      }, 4500);
    } catch (err) {
      console.log(err)
      setResponse(null);
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <img 
            src="https://res.cloudinary.com/dlasn7jtv/image/upload/v1735719280/llocvfzlg1mojxctm7v0.png" 
            alt="Oloyox Logo" 
            className="h-32 w-auto"
          />
        </div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gray-800 mb-2 text-center"
        >
          Enter Your BH ID
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center mb-6"
        >
          Register at oloyox.com and start earning today
        </motion.p>

        <div className="space-y-4">
          <div className="relative">
            <label
              htmlFor="bhId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Referral ID
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="bhId"
              type="text"
              value={bh}
              onChange={(e) => setBh(e.target.value)}
              placeholder="Enter your BH ID"
              className="block w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={checkBhId}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <UserCheck className="h-5 w-5" />
                <span>Verify BH ID</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>

          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
            >
              <UserCheck className="h-5 w-5 text-green-500" />
              <p className="text-sm">
                {response.message || 'BH ID verified successfully!'} Redirecting...
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BhVerification;