import express from 'express'
import sponsorControllers from './sponsor.controllers.js'
import requestValidator from '../../middlewares/requestValidator.js'
import SponsorValidationZodSchema from './sponsor.validation.js'
import authorization from '../../middlewares/authorization.js'
import s3Upload from '../../middlewares/s3FileUploader.js'

const sponsorRouter = express.Router()

// splash screen will replaced by sponsor image

sponsorRouter.post('/sponsor-image/create', authorization('user', 'admin', 'super-admin'), sponsorControllers.createSplashScreen)
sponsorRouter.patch(
  '/sponsor-image/update/:id',
  authorization('user', 'admin', 'super-admin'),
  requestValidator(SponsorValidationZodSchema.getSpecificSplashScreenZodSchema),
  sponsorControllers.updateSplashScreen
)
sponsorRouter.post('/ads/create', authorization('user', 'admin', 'super-admin'), sponsorControllers.createAds)
sponsorRouter.patch(
  '/ads/update/:id',
  authorization('user', 'admin', 'super-admin'),
  requestValidator(SponsorValidationZodSchema.getSpecificAdsZodSchema),
  sponsorControllers.updateAds
)
sponsorRouter.get('/retrive', authorization('user', 'admin', 'super-admin'), sponsorControllers.getSponsor)

sponsorRouter.get('/retrive/app-user/:userId', authorization('user', 'admin', 'super-admin'), sponsorControllers.getSponsorByAppUser)
sponsorRouter.get('/retrive/ad/app-user/:userId', authorization('user', 'admin', 'super-admin'), sponsorControllers.getAdsByAppUser)

export default sponsorRouter
