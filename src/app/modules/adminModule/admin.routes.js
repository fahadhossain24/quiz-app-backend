import express from "express";
import adminControllers from "./admin.controllers.js";
import authorization from "../../middlewares/authorization.js";
import s3Upload from "../../middlewares/s3FileUploader.js";

const adminRouter = express.Router();

adminRouter.post('/create', authorization('super-admin'), adminControllers.createAdmin)
adminRouter.get('/retrive/all', adminControllers.getAllAdmin)
adminRouter.get('/retrive/:id', adminControllers.getSpecificAdmin)
adminRouter.patch('/update/:id', authorization('super-admin'),  adminControllers.updateSpecificAdmin)
adminRouter.delete('/delete/:id', authorization('super-admin'),  adminControllers.deleteSpecificAdmin)
adminRouter.patch('/update/profile-picture/:id', s3Upload('image'), adminControllers.changeAdminProfileImage)

// admin auth
adminRouter.post('/login', adminControllers.adminLogin)
adminRouter.post('/forget-password/send-otp', adminControllers.sendOTP)
adminRouter.post('/verify-otp', adminControllers.verifyOTP)
adminRouter.post('/reset-password', adminControllers.resetPassword)
adminRouter.post('/change-password', adminControllers.changePassword)

export default adminRouter;