import Ads from './ads.model.js'
import SplashScreen from './splashScreen.model.js'

// service to create splash screen
const createSplashScreen = async (data) => {
  return await SplashScreen.create(data)
}

// service to get specific splash screen
const getSponsorImageExistance = async () => {
  return await SplashScreen.findOne()
}

// service to get specific splash screen
const getSpecificSplashScreen = async (id) => {
  return await SplashScreen.findOne({_id: id})
}

// service to update splash screen
const updateSplashScreen = async (id, data) => {
  return await SplashScreen.updateOne({ _id: id }, data, {
    runValidators: true
  })
}

// service to create new ads
const createAds = async (data) => {
  return await Ads.create(data)
}

// service to get specific ads
const getAds = async () => {
  return await Ads.findOne()
}

// service to get specific ads
const getSpecificAds = async (id) => {
  return await Ads.findOne({_id: id})
}

// service to update ads
const updateAds = async (id, data) => {
  return await Ads.updateOne({ _id: id }, data, {
    runValidators: true
  })
}

const getSponsor = async () => {
  const splashScreen = await SplashScreen.findOne({})
  const ads = await Ads.findOne({})

  return {
    sponsorImage: {
      image: splashScreen.image,
      status: splashScreen.status,
      _id: splashScreen._id,
      lastUpdate: splashScreen.updatedAt
    },
    ads: {
      content: ads.content,
      status: ads.status,
      showing_period: ads.showing_period,
      _id: ads._id,
      lastUpdate: ads.updatedAt
    }
  }
}

export default {
  createSplashScreen,
  getSponsorImageExistance,
  getSpecificSplashScreen,
  updateSplashScreen,
  createAds,
  getAds,
  getSpecificAds,
  updateAds,
  getSponsor,
}
