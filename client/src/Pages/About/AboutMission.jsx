import React from 'react';
import { motion } from 'framer-motion';
import about from './girlleft.png'

const AboutMission = () => {
  return (
    <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                          <div className="inline-block bg-red-500 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
      <span className="text-white text-4xl font-bold tracking-wide uppercase">About Us</span>
    </div>
    
                            <h2 className="text-4xl font-bold">Revolutionizing Multiple Industries</h2>
                            <p className="text-gray-600 leading-relaxed">
                            At OLYOX Private Ltd, we take pride in our ISO certification, a testament to our unwavering commitment to excellence across all our services. Our mission is to transform industries by delivering innovative solutions in four key sectors: cab services, tiffin delivery, hotel booking, and heavy transport bookings. Additionally, we empower our users with a robust referral program that enhances accessibility and rewards loyalty.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                            Through our state-of-the-art online platform, we’ve built a global network that seamlessly connects users to the services they need, anytime and anywhere. Whether it’s booking a comfortable ride, enjoying fresh and reliable tiffin services, securing accommodations at top-tier hotels, or managing heavy transport logistics, OLYOX is your trusted partner.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                            Our vision goes beyond providing services; we strive to redefine convenience and efficiency across multiple sectors, ensuring an unparalleled experience for every user. Join us in our journey to revolutionize how the world connects and operates.
                            </p>
                            {/* <Link className='mt-10 border px-3 py-2 leading-relaxed' to={'/about'}>Read More</Link> */}
                        </motion.div>
    
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative flex items-center justify-center"
                        >
                            <img
                                src={about}
                                alt="Our Mission"
                                className="rounded-2xl w-full"
                            />
                            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </section>
  );
}

export default AboutMission;