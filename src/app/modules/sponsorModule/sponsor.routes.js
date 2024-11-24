import express from "express";
import sponsorControllers from "./sponsor.controllers.js";
import requestValidator from "../../middlewares/requestValidator.js";
import SponsorValidationZodSchema from "./sponsor.validation.js";
import authorization from "../../middlewares/authorization.js";

const sponsorRouter = express.Router();

// splash screen will replaced by sponsor image

sponsorRouter.post('/sponsor-image/create', authorization('user', 'admin'), sponsorControllers.createSplashScreen)
sponsorRouter.patch('/sponsor-image/update/:id', authorization('user', 'admin'), requestValidator(SponsorValidationZodSchema.getSpecificSplashScreenZodSchema), sponsorControllers.updateSplashScreen)
sponsorRouter.post('/ads/create', authorization('user', 'admin'), sponsorControllers.createAds)
sponsorRouter.patch('/ads/update/:id', authorization('user', 'admin'), requestValidator(SponsorValidationZodSchema.getSpecificAdsZodSchema), sponsorControllers.updateAds)
sponsorRouter.get('/retrive', authorization('user', 'admin'), sponsorControllers.getSponsor)

export default sponsorRouter;