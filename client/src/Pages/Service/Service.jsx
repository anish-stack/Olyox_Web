import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ServiceCard } from './ServiceCard';
import ServiceHero from './ServiceHero';
import trans from './trans.jpeg'
import ride from './ride.jpeg'
import hotel from './hotel.jpeg'
import tiffin from './tiffin.jpeg'

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

function Service() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    React.useEffect(()=>{
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },[])

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            {/* Background Decoration */}
            {/* <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
            </div> */}

            <div className="container mx-auto px-6 relative z-10">
                <ServiceHero />

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
        </section>
    )
}

export default Service
