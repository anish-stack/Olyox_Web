import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ServiceCard } from '../../Pages/Service/ServiceCard';
import trans from './trans.jpeg'
import ride from './ride.jpeg'
import hotel from './hotel.jpeg'
import tiffin from './tiffin.jpeg'
import './animations.css';

const services = [
  {
    title: "Rider Service",
    description: "Book rides instantly, like OLX but better. Travel anywhere with trusted drivers.",
    image: ride,
  },
  {
    title: "Hotel Booking",
    description: "Find and book comfortable stays across the country, OYO-style experience.",
    image: hotel,
  },
  {
    title: "Tiffin Service",
    description: "Fresh, homely meals delivered to your doorstep. Choose from various providers.",
    image: tiffin,
  },
  {
    title: "Heavy Vehicle Transport",
    description: "Reliable transport solutions for heavy vehicles and cargo delivery.",
    image: trans,
  }
];

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="services" className="py-20 bg-[#FFF4F4]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600">Everything you need, all in one place</p>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* <ServiceHero /> */}

          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                index={index}
                {...service}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;