import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Message</label>
          <textarea
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