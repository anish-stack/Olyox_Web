import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer, // Dashboard
  cilImage,       // Banner & Images
  cilText,        // Testimonial & Blogs
  cilUser,        // All User
  cilGroup,       // All Provider
  cilChatBubble,  // All Chat
  cilWallet,      // Withdraw Request
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [

  {
    component: CNavItem,
    name: 'All Vendor',
    to: '/vendor/all_vendor',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'All Users',
    to: '/All/all-Users',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'App Vendor',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Tiffin Vendor',
        to: '/tiffin/all-tiffin-vendor',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Hotel Vendor',
        to: '/hotel/all-hotel-vendor',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Cab Vendor',
        to: '/cab/all-cab-vendor',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Heavy Transport Vendor',
        to: '/heavy/all-heavy-transport-vendor',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'All Booking',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Tiffin Booking',
        to: '/tiffin/all-tiffin-booking',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Hotel Booking',
        to: '/hotel/all-hotel-booking',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Cab Booking',
        to: '/cab/all-cab-booking',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Heavy Transport Booking',
        to: '/all-heavy-vehical-order',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Parcel Booking',
        to: '/all-parcel-order',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
    ],
  },

  {
    component: CNavItem,
    name: 'Car List',
    to: '/cars/all-cars-list',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cancel Reason',
    to: '/all-cancel-reason',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categories',
    to: '/category/all_category',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'All Coupons',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Coupons',
        to: '/coupon/all_coupon',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Food Coupon',
        to: '/all-food-coupon',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Parcel Coupon',
        to: '/all-parcel-coupon',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Bonus Coupon',
        to: '/all-bonus-coupon',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Duty List',
    to: '/Duty/all-Duty',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Enquiry',
    to: '/enquiry/all-enuqiry',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Heavy Transport Category',
    to: '/all-heacy-transport-category',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Heavy Transport Option',
    to: '/all-heacy-transport-option',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Home Banner',
    to: '/all-home-banner',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Login Bug Report',
    to: '/all-login-bug-report',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Onboarding Slider',
    to: '/onboarding/all-onboarding',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Privacy Policy',
    to: '/all-privacy-policy',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Parcel Vehical',
    to: '/all-parcel-vehical',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Recharge History',
    to: '/recharge/all-recharge',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Referral',
    to: '/refferal/all-refferal',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Subscription Type',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Subscription',
        to: '/subscription/all_subscription',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Tiffin Subscription',
        to: '/subscription/all_tiffin',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Cab Subscription',
        to: '/subscription/all_cab',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Parcel Subscription',
        to: '/subscription/all_parcel',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Bike Parcel Subscription',
        to: '/subscription/all_bike',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Transport Subscription',
        to: '/subscription/all_transport',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Hotel Subscription',
        to: '/subscription/all_hotel',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings/edit-settings',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Withdraw Request',
    to: '/withdraw/all-withdraw',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
]

export default _nav
