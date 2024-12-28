import React from 'react'
import { Link } from 'react-router-dom'

function AppComponent() {
    return (
        <div className=' bg-[#FFF4F4] sm:p-12 py-12'>
            <div className="container mx-auto px-6">
                <div className=' text-center'>
                    <h2 className=' text-4xl font-bold mb-4'>Download App For Best Experience</h2>
                    <p className="text-gray-600 mb-4">Download the Olyox app for the best experience, offering tailored solutions for both users and vendors alike.</p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
                        <Link
                            to={''}
                            className='w-full sm:w-auto text-center font-bold text-[#A91E1B] bg-white py-3 px-6 border border-[#A91E1B] rounded-xl hover:text-white hover:bg-[#A91E1B]'
                        >
                            Download User App
                        </Link>
                        <Link
                            to={''}
                            className='w-full sm:w-auto text-center font-bold text-[#A91E1B] bg-white py-3 px-6 border border-[#A91E1B] rounded-xl hover:text-white hover:bg-[#A91E1B]'
                        >
                            Download Vendor App
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AppComponent
