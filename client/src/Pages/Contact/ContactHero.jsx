import React from 'react';
import { motion } from 'framer-motion';

const ContactHero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center bg-gradient-to-b from-primary/5 to-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div style={{backgroundColor:'#DA2D29'}} className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactHero;