import React from 'react';
import { FooterColumn } from './FooterColumn';
import { FooterLink } from './FooterLink';
import { SocialIcon } from './SocialIcon';
import { StoreButton } from './StoreButton';
import logo from './logo.png'
const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-12 relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5   gap-12">
          {/* Company Info */}
          <FooterColumn title="">
            <div className="mb-6">
            <img src={logo} className='w-24' />
              <p className="text-gray-400 leading-relaxed">
                Your one-stop platform for all services. We make everyday life easier with our comprehensive solutions.
              </p>
            </div>
          </FooterColumn>

          {/* Quick Links */}
          <FooterColumn title="Quick Links">
            <nav>
              <FooterLink href="/service">Our Services</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/term">Term and condition</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
            </nav>
          </FooterColumn>
          <FooterColumn title="Connect With Us">
            <nav>
              <FooterLink>01141236789</FooterLink>
              <FooterLink >+91 7015716178</FooterLink>
              <FooterLink>helpcenter@olyox.com</FooterLink>
              <FooterLink >Habitat Arcade # 49, Sector 99A,
Gurugram, Haryana - 122505</FooterLink>
            </nav>
          </FooterColumn>

          {/* Social Links */}
          <FooterColumn title="Connect With Us">
            <div className="flex space-x-4 mb-8">
              <SocialIcon
                href="https://www.facebook.com/profile.php?id=61575696205269"

                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                }
              />
              <SocialIcon
                href="https://youtube.com/@olyoxofficial?si=sxkwe2d-l3k6jS9-"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.99 2.99 0 0 0-2.107-2.113C19.745 3.5 12 3.5 12 3.5s-7.745 0-9.391.573A2.99 2.99 0 0 0 .502 6.186 31.06 31.06 0 0 0 0 12a31.06 31.06 0 0 0 .502 5.814 2.99 2.99 0 0 0 2.107 2.113C4.255 20.5 12 20.5 12 20.5s7.745 0 9.391-.573a2.99 2.99 0 0 0 2.107-2.113A31.06 31.06 0 0 0 24 12a31.06 31.06 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>

                }
              />
              <SocialIcon
                href="https://www.instagram.com/olyox_official/"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                }
              />
            </div>
            <p className="text-gray-400">Follow us for updates and news</p>
          </FooterColumn>

          {/* Download Apps */}
          <FooterColumn title="Get Our App">
            <div className="space-y-4">
              <StoreButton
                href="https://apps.apple.com/in/app/olyox-book-cab-hotel-food/id6744582670?platform=iphone"
                storeName="App Store"
                target="_blank"
                icon={
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                }
                className="mb-3"
              />
              <StoreButton
                href="https://play.google.com/store/search?q=olyox&c=apps&hl=en"
                storeName="Google Play"
                target="_blank"
                icon={
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 20.5v-17c0-.76.43-1.42 1.05-1.76L14.87 12 4.05 22.26C3.43 21.92 3 21.26 3 20.5zM21 12L13 5v14l8-7zm-1.47-7.12l-9.47 8.62 9.47 8.62c.31-.34.5-.79.5-1.29v-14.66c0-.5-.19-.95-.5-1.29z" />
                  </svg>
                }
              />
            </div>
          </FooterColumn>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Olyox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
