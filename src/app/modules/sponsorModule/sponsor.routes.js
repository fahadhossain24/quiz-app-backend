import express from "express";
import sponsorControllers from "./sponsor.controllers.js";
import requestValidator from "../../middlewares/requestValidator.js";
import SponsorValidationZodSchema from "./sponsor.validation.js";

const sponsorRouter = express.Router();

// splash screen will replaced by sponsor image

sponsorRouter.post('/sponsor-image/create', sponsorControllers.createSplashScreen)
sponsorRouter.patch('/sponsor-image/update/:id', requestValidator(SponsorValidationZodSchema.getSpecificSplashScreenZodSchema), sponsorControllers.updateSplashScreen)
sponsorRouter.post('/ads/create', sponsorControllers.createAds)
sponsorRouter.patch('/ads/update/:id', requestValidator(SponsorValidationZodSchema.getSpecificAdsZodSchema), sponsorControllers.updateAds)
sponsorRouter.get('/retrive', sponsorControllers.getSponsor)

export default sponsorRouter;