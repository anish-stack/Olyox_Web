import React, { useState } from 'react';

function AppComponent() {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className='bg-[#FFF4F4] sm:p-12 py-12'>
            <div className="container mx-auto px-6">
                <div className='text-center'>
                    <h2 className='text-4xl font-bold mb-4'>Download App For Best Experience</h2>
                    <p className="text-gray-600 mb-4">Download the Olyox app for the best experience, offering tailored solutions for both users and vendors alike.</p>
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-3 relative'>
                        {/* <a
                            href={'https://drive.google.com/file/d/1hRmNgJuy9sMs4sGibVWwbVT9TZzrbvfh/view?usp=sharing'}
                            download
                            target='_blank'
                            filename='Olyox.apk'
                            className='w-full sm:w-auto text-center font-bold text-[#A91E1B] bg-white py-3 px-6 border border-[#A91E1B] rounded-xl hover:text-white hover:bg-[#A91E1B]'
                        >
                            Download User App
                        </a> */}
                        <a
                            href={'https://play.google.com/store/apps/details?id=com.happy_coding.olyox'}
                            target='_blank'
                            filename='Olyox.apk'
                            className='w-full sm:w-auto text-center font-bold text-[#A91E1B] bg-white py-3 px-6 border border-[#A91E1B] rounded-xl hover:text-white hover:bg-[#A91E1B]'
                        >
                            Download User App
                        </a>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className='w-full sm:w-auto text-center font-bold text-[#A91E1B] bg-white py-3 px-6 border border-[#A91E1B] rounded-xl hover:text-white hover:bg-[#A91E1B] relative'
                        >
                            Download Vendor App
                        </button>
                        {showDropdown && (
                            <div className='absolute top-full z-10 mt-2 bg-white border border-[#A91E1B] rounded-xl shadow-lg flex flex-col w-full sm:w-auto'>
                                <a href='https://drive.google.com/file/d/18vJyvF6wcZyFrTePw2D1dehPloNXH-N1/view' download target='_blank' className='block px-6 py-3 text-[#A91E1B] hover:bg-[#A91E1B] hover:text-white'>Download Cab APK</a>
                                <a href='https://drive.google.com/file/d/18vJyvF6wcZyFrTePw2D1dehPloNXH-N1/view' download target='_blank' className='block px-6 py-3 text-[#A91E1B] hover:bg-[#A91E1B] hover:text-white'>Download Parcel APK</a>
                                <a href='https://drive.google.com/file/d/1JuN46wKIAxzFMvABC-Rj8rOmO99kQxTi/view?usp=sharing' download target='_blank' className='block px-6 py-3 text-[#A91E1B] hover:bg-[#A91E1B] hover:text-white'>Download Hotel APK</a>
                                <a href='https://drive.google.com/file/d/1HHxAAppYfZ5EhQqGufEHI8lzgBFoJ_bg/view?usp=sharing' download target='_blank' className='block px-6 py-3 text-[#A91E1B] hover:bg-[#A91E1B] hover:text-white'>Download Tiffin APK</a>
                                <a href='https://drive.google.com/file/d/1arYU5LnobEmfFtst6n9EVqeG915yx9na/view?usp=sharing' download target='_blank' className='block px-6 py-3 text-[#A91E1B] hover:bg-[#A91E1B] hover:text-white'>Download Transport APK</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppComponent;
