import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactDetails = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Visit Us",
    details: ["OLYOX Pvt. Ltd. Habitat Arcade S.No. 49, ", "Sector 99 A, Dwarka Expresway, Gurugram 122505"]
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    details: ["011-4123-6789"]
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    details: ["helpcenter@olyox.com"]
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Working Hours",
    details: ["Monday - Friday: 10:00 AM - 6:00 PM", "Saturday: 10:00 AM - 2:00PM"]
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
        <p className='mb-3'>At OLYOX Pvt. Ltd., our Help Center is your go-to resource for comprehensive assistance. Our dedicated support team is committed to addressing your queries promptly and efficiently, ensuring a seamless experience. Whether it's technical assistance or general inquiries, trust OLYOX Help Center for reliable guidance and support around the clock.

</p>
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