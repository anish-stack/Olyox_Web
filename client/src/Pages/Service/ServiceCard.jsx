import React from 'react';
import { motion } from 'framer-motion';

export const ServiceCard = ({ title, description, image, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />
      
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
        <h3 className="text-2xl font-bold mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-200 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {description}
        </p>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 rounded-full border-2 border-white border-t-transparent"
          />
        </span>
      </div>
    </motion.div>
  );
};