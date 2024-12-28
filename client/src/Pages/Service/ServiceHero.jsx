import React from 'react';
import { motion } from 'framer-motion';

function ServiceHero() {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Our Services
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Experience excellence through our comprehensive range of professional services,
          designed to exceed your expectations
        </p>
      </motion.div>
    </div>
  )
}

export default ServiceHero
