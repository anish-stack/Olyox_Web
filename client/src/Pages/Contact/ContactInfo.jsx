import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactDetails = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Visit Us",
    details: ["123 Business Street", "Tech City, TC 12345", "India"]
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    details: ["+91 123 456 7890", "+91 987 654 3210"]
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    details: ["contact@olyox.com", "support@olyox.com"]
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Working Hours",
    details: ["Monday - Friday: 9AM - 6PM", "Saturday: 9AM - 2PM"]
  }
];

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
        <div className="space-y-8">
          {contactDetails.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                {item.details.map((detail, i) => (
                  <p key={i} className="text-gray-600">{detail}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;