import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import axios from 'axios';

const ContactForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // State to handle success/error message display
  const [statusMessage, setStatusMessage] = useState('');

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setStatusMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      // Send POST request to your API
      const response = await axios.post('https://webapi.olyox.com/api/v1/enquiries', formData);
console.log(response.data)
      // On success, display success message
    
        setStatusMessage('Message sent successfully Our Team Contact You Soon!');
        // Optionally clear the form after success
        setFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error) {
      console.log(error)
      setStatusMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>

      {/* Success or Error Message */}
      {statusMessage && (
        <div
          className={`text-center mb-4 p-3 rounded-lg ${statusMessage.includes('success') ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            rows="5"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-[#D72C28] text-white py-4 rounded-lg hover:bg-[#D72C28] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Send Message
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
