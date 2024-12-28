import React from 'react';
import { motion } from 'framer-motion';

const values = [
  {
    title: "Innovation",
    description: "Constantly seeking new ways to improve and enhance our offerings",
    icon: "💡"
  },
  {
    title: "Excellence",
    description: "Delivering exceptional experiences from start to finish",
    icon: "⭐"
  },
  {
    title: "Reliability",
    description: "Ensuring convenience and dependability in every service",
    icon: "🎯"
  },
  {
    title: "Trust",
    description: "Building lasting relationships with our users",
    icon: "🤝"
  }
];

const AboutValues = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-gray-600">
            What sets us apart is not just our technological prowess, but our dedication 
            to delivering exceptional experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutValues;