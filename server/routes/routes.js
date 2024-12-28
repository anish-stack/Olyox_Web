const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {

        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

const { registerVendor, verifyVendorEmail, resendOtp, loginVendor, logoutVendor, changeVendorPassword, changeVendorCategory, deleteVendorAccount, updateVendorDetails, getSingleProvider, updatePassword } = require('../controllers/vendor.controller');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { createMembershipPlan, getAllMembershipPlans, getMembershipPlanById, updateMembershipPlan, deleteMembershipPlan } = require('../controllers/Member_ship.controller');

router.post('/register_vendor', upload.any(), registerVendor);
// upload.fields([
//     { name: 'imageone', maxCount: 1 },
//     { name: 'imagetwo', maxCount: 1 }
// ])(req, res, (err) => {
//     if (err) {
//         return res.status(400).json({ error: err.message });
//     }
//     next();
// });
router.post('/verify_email', verifyVendorEmail);
router.post('/resend_Otp', resendOtp);
router.post('/login', loginVendor);
router.post('/logout', logoutVendor);
router.post('/change_Vendor_Category', changeVendorCategory);
router.post('/change_Vendor_Password', changeVendorPassword);
router.delete('/delete_account', deleteVendorAccount);
router.put('/update_account/:id', updateVendorDetails);
router.get('/get_Single_Provider/:id',getSingleProvider);
// router.put('/update_password/:id', updatePassword);






// category CRUD routes
router.post('/categories_create', createCategory);
router.get('/categories_get', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);


// membership plan CRUD routes
router.post('/membership-plans-create', createMembershipPlan); 
router.get('/membership-plans', getAllMembershipPlans); 
router.get('/membership-plans/:id', getMembershipPlanById); 
router.put('/membership-plans/:id', updateMembershipPlan); 
router.delete('/membership-plans/:id', deleteMembershipPlan); 







module.exports = router;
