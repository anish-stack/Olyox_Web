import React from 'react'
import AllCategory from './views/Category/AllCategory'
import AddCategory from './views/Category/AddCategory'
import EditCategory from './views/Category/EditCategory'
import AllMembership from './views/Membership/AllMembership'
import AddMembership from './views/Membership/AddMembership'
import EditMember from './views/Membership/EditMember'
import AddVendor from './views/Vendor/AddVendor'
import EditVendor from './views/Vendor/EditVendor'
import AllVendor from './views/Vendor/AllVendor'
import VendorDetail from './views/Vendor/VendorDetail'
import AllRecharge from './views/Recharge/AllRecharge'
import AllWithdraw from './views/Withdraw/AllWithdraw'
import AllActiveRefferal from './views/ActiveRefferal/AllActiveRefferal'
import AllEnquiry from './views/enquiry/AllEnquiry'
import Roles from './views/Rols/Roles'
import Dutyist from './views/DutyList/Duty.list'
import AllUser from './views/All user/AllUser'
import AllSettings from './views/Settings/AllSettings'
import EditSetting from './views/Settings/EditSetting'
import Onboarding from './views/Onboarding/Onboarding'
import AddOnboarding from './views/Onboarding/AddOnboarding'
import EditOnboarding from './views/Onboarding/EditOnboarding'
import AllCarList from './views/CarList/AllCarList'
import AddCarList from './views/CarList/AddCarList'
import EditCarList from './views/CarList/EditCarList'
import AllTiffinVendor from './views/TiffinVendor/AllTiffinVendor'
import TiffinVendorDetail from './views/TiffinVendor/TiffinVendorDetail'

import EditTiffinVendor from './views/TiffinVendor/EditTiffinVendor'
import AllHoteslVendor from './views/HoteslVendor/AllHoteslVendor'
import HotelVendor from './views/HoteslVendor/HotelVendor'
import AllCabVendor from './views/CabVendor/AllCabVendor'
import CabDetail from './views/CabVendor/CabDetail'
import AllParcelVendor from './views/ParcelVendor/AllParcelVendor'
import ParcelDetail from './views/ParcelVendor/ParcelDetail'
import EditParcelVendor from './views/ParcelVendor/EditParcelVendor'
import EditCabVendor from './views/CabVendor/EditCabVendor'
import EditHotelVendor from './views/HoteslVendor/EditHotelVendor'
import DutyRiderDetail from './views/DutyList/DutyRiderDetail'
import AllRiderLocation from './views/DutyList/AllRiderLocation'
import TiffinBooking from './views/Booking/TiffinBooking'
import HotelBooking from './views/Booking/HotelBooking'
import HotelBookingDetail from './views/Booking/HotelBookingDetail'
import CabBooking from './views/Booking/CabBooking'
import CabBookingDetail from './views/Booking/CabBookingDetail'
import ParcelBooking from './views/Booking/ParcelBooking'
import AllHeavyTransport from './views/HeavyTransport/AllHeavyTransport'
import AddHeavyTransport from './views/HeavyTransport/AddHeavyTransport'
import EditHeavyTransport from './views/HeavyTransport/EditHeavyTransport'
import CancelReson from './views/CancelReson/CancelReson'
import AddCancelReson from './views/CancelReson/AddCancelReson'
import EditCancelReson from './views/CancelReson/EditCancelReson'
import HotelListing from './views/HoteslVendor/HotelListing'
import TiffinFoodListing from './views/TiffinVendor/TiffinFoodListing'
import TiffinListing from './views/TiffinVendor/TiffinListing'
import RiderTime from './views/CabVendor/RiderTime'
import TiffinSubscription from './views/Subscription/TiffinSubscription'
import AddTiffinSubscription from './views/Subscription/AddTiffinSubscription'
import EditTiffinSubscription from './views/Subscription/EditTiffinSubscription'
import CabSubscription from './views/Subscription/CabSubscription'
import AddCabSubscription from './views/Subscription/AddCabSubscription'
import EditCabSubscription from './views/Subscription/EditCabSubscription'
import ParcelSubscription from './views/Subscription/ParcelSubscription'
import AddParcelSubscription from './views/Subscription/AddParcelSubscription'
import EditParcelSubscription from './views/Subscription/EditParcelSubscription'
import TransportSubscription from './views/Subscription/TransportSubscription'
import AddTransportSubscription from './views/Subscription/AddTransportSubscription'
import EditTransportSubscription from './views/Subscription/EditTransportSubscription'
import AllCoupon from './views/Coupon/AllCoupon'
import AddCoupon from './views/Coupon/AddCoupon'
import EditCoupon from './views/Coupon/EditCoupon'
import AllSubscription from './views/Subscription/AllSubscription'
import AllLoginBugReport from './views/LoginBugReport/AllLoginBugReport'
import AllPrivacyPolicy from './views/PrivacyPolicy/AllPrivacyPolicy'
import AddPrivacyPolicy from './views/PrivacyPolicy/AddPrivacyPolicy'
import EditPrivacyPolucy from './views/PrivacyPolicy/EditPrivacyPolucy'
import AllHeavyTransportVendor from './views/HeavyTransportVendor/AllHeavyTransportVendor'
import HeavyTransportVendorDetail from './views/HeavyTransportVendor/HeavyTransportVendorDetail'
import EditHeavyTransportVendor from './views/HeavyTransportVendor/EditHeavyTransportVendor'
import AllHeavyVehicalTransportCategory from './views/HeavyVehicalTransportCategory/AllHeavyVehicalTransportCategory'
import AddHeavyVehicalTransportCategory from './views/HeavyVehicalTransportCategory/AddHeavyVehicalTransportCategory'
import EditHeavyVehicalTransportCategory from './views/HeavyVehicalTransportCategory/EditHeavyVehicalTransportCategory'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))


// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },

  { path: '/widgets', name: 'Widgets', element: Widgets },



  // category routes here 
  { path: '/category', name: 'Category', element: Cards, exact: true },
  { path: '/category/add-category', name: 'Add Category', element: AddCategory },
  { path: '/category/edit-category/:id', name: 'Edit Category', element: EditCategory },
  { path: '/category/all_category', name: 'All Category', element: AllCategory },

  // membership routes here 
  { path: '/membership', name: 'Membership', element: Cards, exact: true },
  { path: '/membership/add-membership', name: 'Add Category', element: AddMembership },
  { path: '/membership/edit-membership/:id', name: 'Edit Category', element: EditMember },
  { path: '/membership/all_membership', name: 'All Membership', element: AllMembership },

  // vendor routes here 
  { path: '/vendor', name: 'Vendor', element: Cards, exact: true },
  { path: '/vendor/add-vendor', name: 'Add Vendor', element: AddVendor },
  { path: '/vendor/edit-vendor/:id', name: 'Edit Vendor', element: EditVendor },
  { path: '/vendor/all_vendor', name: 'All Vendor', element: AllVendor },
  { path: '/vendor/vendor_detail/:id', name: 'All Vendor', element: VendorDetail },


  // vendor qnwuire here 
  { path: '/enquiry/all-enuqiry', name: 'Enquiry', element: AllEnquiry },

  { path: '/Sub/all-sub', name: 'Roles Of Sub Admin', element: Roles },

  { path: '/Duty/all-Duty', name: 'Duty List', element: Dutyist },
  { path: '/Duty/duty-rider-detail/:id', name: 'Duty Rider Detail', element: DutyRiderDetail },
  { path: '/Duty/all-rider-location', name: 'All Rider Location', element: AllRiderLocation },
  { path: '/All/all-Users', name: 'Users', element: AllUser },



  // recharge routes here 
  { path: '/recharge', name: 'Recharge', element: Cards, exact: true },
  { path: '/recharge/all-recharge', name: 'All Category', element: AllRecharge },

  // withdraw routes here 
  { path: '/withdraw', name: 'Withdraw', element: Cards, exact: true },
  { path: '/withdraw/all-withdraw', name: 'All Withdraw', element: AllWithdraw },

  // refferal routes here 
  { path: '/Refferal', name: 'Refferal', element: Cards, exact: true },
  { path: '/refferal/all-refferal', name: 'All Refferal', element: AllActiveRefferal },

  // refferal routes here 
  { path: '/Settings', name: 'Settings', element: Cards, exact: true },
  { path: '/settings/edit-settings', name: 'Edit Settings', element: EditSetting },

  // refferal routes here 
  { path: '/Onboarding', name: 'Onboarding', element: Cards, exact: true },
  { path: '/onboarding/all-onboarding', name: 'All Onboarding', element: Onboarding },
  { path: '/onboarding/add-onboarding', name: 'Add Onboarding', element: AddOnboarding },
  { path: '/onboarding/edit-onboarding/:id', name: 'Edit Onboarding', element: EditOnboarding },

  // refferal routes here 
  { path: '/Cars List', name: 'Cars List', element: Cards, exact: true },
  { path: '/cars/all-cars-list', name: 'All Cars List', element: AllCarList },
  { path: '/cars/add-cars-list', name: 'Add Cars List', element: AddCarList },
  { path: '/cars/edit-cars-list/:id', name: 'Edit Cars List', element: EditCarList },

  // refferal routes here 
  { path: '/Subscription List', name: 'Subscription List', element: Cards, exact: true },
  { path: '/subscription/all_tiffin', name: 'All Tiffin Subscription', element: TiffinSubscription },
  { path: '/subscription/add-tiffin', name: 'Add Tiffin Subscription', element: AddTiffinSubscription },
  { path: '/subscription/edit-tiffin/:id', name: 'Edit Tiffin Subscription', element: EditTiffinSubscription },
  { path: '/subscription/all_cab', name: 'All Cab Subscription', element: CabSubscription },
  { path: '/subscription/add-cab', name: 'Add Cab Subscription', element: AddCabSubscription },
  { path: '/subscription/edit-cab/:id', name: 'Edit Cab Subscription', element: EditCabSubscription },
  { path: '/subscription/all_parcel', name: 'All Parcel Subscription', element: ParcelSubscription },
  { path: '/subscription/add-parcel', name: 'Add Parcel Subscription', element: AddParcelSubscription },
  { path: '/subscription/edit-parcel/:id', name: 'Edit Parcel Subscription', element: EditParcelSubscription },
  { path: '/subscription/all_transport', name: 'All Transport Subscription', element: TransportSubscription },
  { path: '/subscription/add-transport', name: 'Add Transport Subscription', element: AddTransportSubscription },
  { path: '/subscription/edit-transport/:id', name: 'Edit Transport Subscription', element: EditTransportSubscription },
  { path: '/subscription/all_subscription', name: 'All Subscription', element: AllSubscription },

  // refferal routes here 
  { path: '/Tiffin', name: 'Tiffin', element: Cards, exact: true },
  { path: '/tiffin/all-tiffin-vendor', name: 'All Tiffin', element: AllTiffinVendor },
  { path: '/tiffin/vendor-detail/:id', name: 'Tiffin Vendor Detail', element: TiffinVendorDetail },
  { path: '/tiffin/edit-tiffin-vendor/:id', name: 'Edit Tiffin Vendor Detail', element: EditTiffinVendor },
  { path: '/tiffin/tiffin-listin/:id', name: 'All Tiffin Listing', element: TiffinFoodListing },
  { path: '/tiffin/tiffin-food-listin/:id', name: 'All Food Listing', element: TiffinListing },

  // refferal routes here 
  { path: '/Hotel', name: 'Hotel', element: Cards, exact: true },
  { path: '/hotel/all-hotel-vendor', name: 'All Hotel', element: AllHoteslVendor },
  { path: '/hotel/vendor-detail/:id', name: 'Hotel Vendor Detail', element: HotelVendor },
  { path: '/hotel/edit-hotel-vendor/:id', name: 'Edit Hotel Vendor Detail', element: EditHotelVendor },
  { path: '/hotel/hotel-listin/:id', name: 'Edit Hotel Listing', element: HotelListing },

  // refferal routes here 
  { path: '/Cab', name: 'Cab', element: Cards, exact: true },
  { path: '/cab/all-cab-vendor', name: 'All Cab', element: AllCabVendor },
  { path: '/cab/vendor-detail/:id', name: 'Cab Vendor Detail', element: CabDetail },
  { path: '/cab/edit-cab-vendor/:id', name: 'Edit Cab Vendor Detail', element: EditCabVendor },
  { path: '/cab/rider-time/:id', name: 'Rider Time', element: RiderTime },

  // refferal routes here 
  { path: '/Parcel', name: 'Parcel', element: Cards, exact: true },
  { path: '/parcel/all-parcel-vendor', name: 'All Parcel', element: AllParcelVendor },
  { path: '/parcel/vendor-detail/:id', name: 'Parcel Vendor Detail', element: ParcelDetail },
  { path: '/parcel/edit-parcel-vendor/:id', name: 'Edit Parcel Vendor Detail', element: EditParcelVendor },

  { path: '/tiffin/all-tiffin-booking', name: 'All Tiffin Booking', element: TiffinBooking },
  { path: '/hotel/all-hotel-booking', name: 'All Hotel Booking', element: HotelBooking },
  { path: '/hotel/booking-detail/:id', name: 'Hotel Booking Detail', element: HotelBookingDetail },
  { path: '/cab/all-cab-booking', name: 'All Cab Booking', element: CabBooking },
  { path: '/cab/all-cab-detail/:id', name: 'All Cab Details', element: CabBookingDetail },
  { path: '/parcel/all-parcel-booking', name: 'All Parcel Booking', element: ParcelBooking },

  // heavy transport routes here

  { path: '/heavy/all-heavy-transport-vendor', name: 'All Heavy Transport Vendor', element: AllHeavyTransportVendor },
  // { path: '/hotel/all-hotel-booking', name: 'All Hotel Booking', element: HotelBooking },
  { path: '/heavy/heavy-transport-vendor-detail/:id', name: 'Heavy Transport Vendor Detail', element: HeavyTransportVendorDetail },
  { path: '/heavy/edit-heavy-transport-vendor/:id', name: 'Edit Heavy Transport Vendor', element: EditHeavyTransportVendor },
  // { path: '/cab/all-cab-detail/:id', name: 'All Cab Details', element: CabBookingDetail },
  // { path: '/parcel/all-parcel-booking', name: 'All Parcel Booking', element: ParcelBooking },

  // refferal routes here 
  // { path: '/Parcel', name: 'Parcel', element: Cards, exact: true },
  { path: '/all-heacy-transport-option', name: 'All Heavy Transport', element: AllHeavyTransport },
  { path: '/add-heacy-transport-option', name: 'Add Heavy Transport', element: AddHeavyTransport },
  { path: '/edit-heacy-transport-option/:id', name: 'Edit Heavy Transport', element: EditHeavyTransport },


  { path: '/all-heacy-transport-category', name: 'All Heavy Transport Category', element: AllHeavyVehicalTransportCategory },
  { path: '/add-heacy-transport-category', name: 'Add Heavy Transport Category', element: AddHeavyVehicalTransportCategory },
  { path: '/edit-heacy-transport-category/:id', name: 'Edit Heavy Transport', element: EditHeavyVehicalTransportCategory },


  { path: '/all-cancel-reason', name: 'All Cancel Reason', element: CancelReson },
  { path: '/add-cancel-reason', name: 'Add Cancel Reason', element: AddCancelReson },
  { path: '/edit-cancel-reason/:id', name: 'Edit Cancel Reason', element: EditCancelReson },

  { path: '/coupon/all_coupon', name: 'All Coupons', element: AllCoupon },
  { path: '/coupon/add-coupon', name: 'Add Coupon', element: AddCoupon },
  { path: '/coupon/edit-coupon/:id', name: 'Edit Coupon', element: EditCoupon },

  { path: '/all-login-bug-report', name: 'All Login Report', element: AllLoginBugReport },

  { path: '/all-privacy-policy', name: 'All Privacy', element: AllPrivacyPolicy },
  { path: '/add-privacy-policy', name: 'Add Privacy', element: AddPrivacyPolicy },
  { path: '/edit-privacy-policy/:id', name: 'Edit Privacy', element: EditPrivacyPolucy },

]

export default routes