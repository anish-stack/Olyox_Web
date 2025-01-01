import React from 'react';
import { motion } from 'framer-motion';
import hero from './hero.png'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-4xl lg:text-7xl font-bold mb-6">
              Your One-Stop
              <span className="block mt-2 text-primary">Service Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Experience seamless services across rides, hotels, meals, and transport - all in one place with Olyox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={'/bh'} style={{ color: '#DA2D29' }} className="bg-primary text-white px-8 py-4 rounded-full text-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-primary/30">
                Get Started
              </Link>
              <Link to={'/about'} className="border-2 border-primary text-primary px-8 py-4 rounded-full text-lg hover:bg-primary transition-all transform hover:-translate-y-1">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              <div>
                <h3 className="text-xl sm:text-4xl font-bold text-[#D62C27] mb-2">50K+</h3>
                <p className="text-gray-600">Active Users</p>
              </div>
              <div>
                <h3 className="text-xl sm:text-4xl font-bold text-[#D62C27] mb-2">1K+</h3>
                <p className="text-gray-600">Service Providers</p>
              </div>
              <div>
                <h3 className="text-xl sm:text-4xl font-bold text-[#D62C27] mb-2">100+</h3>
                <p className="text-gray-600">Cities</p>
              </div>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={hero}
                alt="Olyox Services"
                className="rounded-2xl "
              />

              {/* Floating Cards */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -left-16 top-0 bg-white p-4 rounded-xl  hidden md:block"
              >
                {/* <img src="/ride-icon.svg" alt="Ride Service" className="w-12 h-12 mb-2" /> */}
                <span className=' text-4xl'>🚗</span>
                <p className="font-semibold">Ride Service</p>
              </motion.div>

              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
                className="absolute -right-0 top-40 bg-white p-4 rounded-xl shadow-lg hidden md:block"
              >
                {/* <img src="/hotel-icon.svg" alt="Hotel Service" className="w-12 h-12 mb-2" /> */}
                <span className=' text-4xl'>🏨</span>
                <p className="font-semibold">Hotel Booking</p>
              </motion.div>

              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
                className="absolute -left-16 bottom-0 bg-white p-4 rounded-xl shadow-lg hidden md:block"
              >
                {/* <img src="/food-icon.svg" alt="Food Service" className="w-12 h-12 mb-2" /> */}
                <span className="text-4xl">🍱</span>
                <p className="font-semibold">Tiffin Service</p>
              </motion.div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -top-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;