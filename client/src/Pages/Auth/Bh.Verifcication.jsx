import axios from 'axios';
import React, { useState } from 'react';

const BhVerification = () => {
    const [bh, setBh] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const checkBhId = async () => {
        try {
            setError(null);
            const { data } = await axios.post('http://localhost:7000/api/v1/check-bh-id', { bh });
            setResponse(data);
            setTimeout(() => {
                window.location.href = `/register?bh_id=${bh}`
            })
        } catch (err) {
            setResponse(null);
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Enter Referral Id 
                </h2>
                <div className="mb-4">
                    <label
                        htmlFor="bhId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Enter Referral Id
                    </label>
                    <input
                        id="bhId"
                        type="text"
                        value={bh}
                        onChange={(e) => setBh(e.target.value)}
                        placeholder="Enter BH ID"
                        className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={checkBhId}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Check BH ID
                </button>
                {response && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm">
                        {response.message || 'BH ID is valid!'}
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BhVerification;
