import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    title: "Choose Service",
    description: "Select from our wide range of services tailored to your needs",
    icon: "🎯",
    number: "01"
  },
  {
    title: "Book Instantly",
    description: "Quick and easy booking process with real-time confirmation",
    icon: "⚡",
    number: "02"
  },
  {
    title: "Track Progress",
    description: "Monitor your service status with live tracking and updates",
    icon: "📍",
    number: "03"
  },
  {
    title: "Enjoy Service",
    description: "Experience quality service delivery at your convenience",
    icon: "🎉",
    number: "04"
  }
];

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="how-it-works" className="py-20 bg-[#FFF4F4]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600">Simple steps to get started</p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="absolute -top-4 -right-4 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;