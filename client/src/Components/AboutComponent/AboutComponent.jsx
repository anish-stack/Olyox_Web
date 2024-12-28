import React from 'react';
import { motion } from 'framer-motion';
import about from './about.png'
import { Link } from 'react-router-dom';

function AboutComponent() {
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
                        <div className="inline-block bg-primary/10 px-4 py-2 rounded-full">
                            <span className="text-primary font-semibold">About Us</span>
                        </div>
                        <h2 className="text-4xl font-bold">Revolutionizing Multiple Industries</h2>
                        <p className="text-gray-600 leading-relaxed">
                            At OLYOX Private Ltd, we pride ourselves on our ISO certification, signaling our commitment
                            to excellence in every service we provide. Our mission is to revolutionize not just one
                            industry, but multiple sectors including transportation, hospitality, and beyond.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Through our cutting-edge online platform, we have created a global network that effortlessly
                            connects users with the services they need, wherever they may be.
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
                            className="rounded-2xl shadow-2xl w-72"
                        />
                        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AboutComponent
