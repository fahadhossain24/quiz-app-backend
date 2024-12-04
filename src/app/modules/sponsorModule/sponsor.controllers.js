import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import fileUploader from '../../../utils/fileUploader.js'
import CustomError from '../../errors/index.js'
import sponsorServices from './sponsor.services.js'
import AdAndSponsorImpression from './adAandSponsorViewModel.js'

// controller for make new splash screen
const createSplashScreen = async (req, res) => {
  const data = req.body

  const existingSplashScreen = await sponsorServices.getSponsorImageExistance()

  if (existingSplashScreen) {
    throw new CustomError.BadRequestError('You already have a sponsor-image!')
  }

  if (req.files || req.files?.image) {
    const imagePath = await fileUploader(req.files, `splashscreen-image`, 'image')
    // const imagePath = req.files?.image[0].location
    data.image = imagePath
  }
  console.log(data)
  const splashScreen = await sponsorServices.createSplashScreen(data)

  if (!splashScreen) {
    throw new CustomError.BadRequestError('Failed to create new sponsor image!')
  }

  const resPayload = {
    image: splashScreen.image,
    status: splashScreen.status,
    _id: splashScreen._id
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'New sponsor image added successfull!',
    data: resPayload
  })
}

// controller for update splash screen
const updateSplashScreen = async (req, res) => {
  const { id } = req.params
  const data = req.body

  const splashScreen = await sponsorServices.getSpecificSplashScreen(id)
  if (!splashScreen) {
    throw new CustomError.BadRequestError('No splash screen found!')
  }

  if (req.files || req.files?.image) {
    const imagePath = await fileUploader(req.files, `splashscreen-image`, 'image')
    // const imagePath = req.files.image[0].location
    data.image = imagePath
  }

  const updateSplashScreen = await sponsorServices.updateSplashScreen(id, data)

  if (!updateSplashScreen.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update splash screen!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Sponsor image update successfull!'
  })
}

// controller for create ads
const createAds = async (req, res) => {
  const data = req.body

  const existingAds = await sponsorServices.getAds()

  if (existingAds) {
    throw new CustomError.BadRequestError('You already have a ads content!')
  }

  if (req.files || req.files?.content) {
    const contentPath = await fileUploader(req.files, `ads`, 'content')
    // const contentPath = req.files?.content[0].location
    data.content = contentPath
  }

  const ads = await sponsorServices.createAds(data)

  if (!ads) {
    throw new CustomError.BadRequestError('Failed to create ads!')
  }

  const resPayload = {
    content: ads.content,
    status: ads.status,
    _id: ads._id,
    showing_period: ads.showing_period
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Ads creation successfull!',
    data: resPayload
  })
}

// controller for update ads
const updateAds = async (req, res) => {
  const { id } = req.params
  const data = req.body

  const ads = await sponsorServices.getSpecificAds(id)
  if (!ads) {
    throw new CustomError.BadRequestError('No ads found!')
  }

  if (req.files || req.files?.content) {
    const contentPath = await fileUploader(req.files, `ads`, 'content')
    // const contentPath = req.files?.content[0].location
    data.content = contentPath
  }

  const updatedAds = await sponsorServices.updateAds(id, data)

  if (!updatedAds.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update ads!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Ads update successfull!'
  })
}

// controller for get full sponsor
const getSponsor = async (req, res) => {
  const sponsor = await sponsorServices.getSponsor()
  if (!sponsor) {
    throw new CustomError.BadRequestError('Sponsor not found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'sponsor retrive successfull!',
    data: sponsor
  })
}

// controller for get full sponsor
const getSponsorByAppUser = async (req, res) => {
  const { userId } = req.params
  const sponsor = await sponsorServices.getSponsorByAppUser()
  if (!sponsor) {
    throw new CustomError.BadRequestError('Sponsor not found!')
  }

  const sponsorId = sponsor._id
  const existingSponsorView = await AdAndSponsorImpression.findOne({ userId, sponsorId })
  
  if (!existingSponsorView) {
    const newSponsorImpressionPayload = {
      userId,
      sponsorId
    }
    await AdAndSponsorImpression.create(newSponsorImpressionPayload)
    if (sponsor) {
      sponsor.impressionCount += 1
      await sponsor.save()
    }
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'sponsor retrive successfull!',
    data: sponsor
  })
}

// controller for get full sponsor
const getAdsByAppUser = async (req, res) => {
  const { userId } = req.params
  const ad = await sponsorServices.getAdByAppUser()
  if (!ad) {
    throw new CustomError.BadRequestError('Ad not found!')
  }

  const adId = ad._id
  const existingAdView = await AdAndSponsorImpression.findOne({ userId, adId })

  if (!existingAdView) {
    const newAdImpressionPayload = {
      userId,
      adId
    }
    await AdAndSponsorImpression.create(newAdImpressionPayload)
    if (ad) {
      ad.impressionCount += 1
      await ad.save()
    }
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'ad retrive successfull!',
    data: ad
  })
}

export default {
  createSplashScreen,
  updateSplashScreen,
  createAds,
  updateAds,
  getSponsor,
  getSponsorByAppUser,
  getAdsByAppUser
}
