import React, { useState } from 'react';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle Mobile Menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Check Token from Session Storage
    const token = sessionStorage.getItem('token');

    // Reusable Button Logic
    const AuthButton = () => {
        return token ? (
            <Link to={'/dashboard'} className="bg-[#DA2D29] text-white px-4 py-2 rounded-full hover:bg-[#a91e1b] transition-colors">
                Dashboard
            </Link>
        ) : (
            <div className='space-x-2'>
                <Link to={'/bh'} className="bg-[#DA2D29]  md:hidden text-white px-4 py-2 rounded-full hover:bg-[#a91e1b] transition-colors">
                    Register
                </Link>
                <Link to={'/login'} className="bg-[#DA2D29] text-white px-4 py-2 rounded-full hover:bg-[#a91e1b] transition-colors">
                    Login
                </Link>
            </div>
        );
    };

    return (
        <header className="sticky top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to={'/'} className="flex items-center">
                        <img src={logo} alt="Olyox" className="h-12" />
                        <span className="ml-2 hidden md:block text-2xl font-bold text-[#D62C27]">
                            Olyox
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {/* Mobile Auth Button */}
                        <div className="md:hidden">
                            <AuthButton />
                        </div>

                        {/* Hamburger */}
                        <button onClick={toggleMenu} className="md:hidden text-gray-600">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to={'/'} className="text-gray-600 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link to={'/service'} className="text-gray-600 hover:text-blue-600 transition-colors">
                            Services
                        </Link>
                        <Link to={'/about'} className="text-gray-600 hover:text-blue-600 transition-colors">
                            About
                        </Link>
                        <Link to={'/contact'} className="text-gray-600 hover:text-blue-600 transition-colors">
                            Contact
                        </Link>
                        <Link to={'/bh'} className="bg-[#e4313d] text-white px-4 py-2 rounded-full hover:bg-[#a91e1b] transition-colors">
                            Register
                        </Link>
                        {/* Desktop Auth Button */}
                        <AuthButton />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-y-0 left-0 w-64 h-[100vh] bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out md:hidden z-50`}
            >
                <div className="p-6 space-y-6 bg-white">
                    <button onClick={toggleMenu} className="text-gray-600">
                        <X size={28} />
                    </button>
                    <Link to={'/'} className="text-gray-600 block hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    <Link to={'/service'} onClick={toggleMenu} className="block text-gray-600 hover:text-blue-600 transition-colors">
                        Services
                    </Link>

                    <Link to={'/about'} onClick={toggleMenu} className="block text-gray-600 hover:text-blue-600 transition-colors">
                        About
                    </Link>
                    <Link to={'/contact'} onClick={toggleMenu} className="block text-gray-600 hover:text-blue-600 transition-colors">
                        Contact
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
