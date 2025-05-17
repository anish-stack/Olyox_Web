import React from 'react';
import { motion } from 'framer-motion';

const ContactMap = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
         <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3507.5968141452486!2d76.954436!3d28.461568!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d17951e192f8d%3A0x49d9adbe06c19117!2sOlyox!5e0!3m2!1sen!2sus!4v1747506230991!5m2!1sen!2sus" width={'100%'} height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMap;