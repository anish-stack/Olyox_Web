import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    name: 'Jane Smith',
    role: 'CTO',
    image: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    name: 'Mike Johnson',
    role: 'Head of Operations',
    image: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

const AboutTeam = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-600">Meet the people behind Olyox</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;