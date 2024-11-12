import userServices from '../modules/userModule/user.services.js'

const userActivator = async (req, res, next) => {
  if (req.user && req.user.id) {
    await userServices.updateSpecificUser(req.user._id, {isActive: true})
  }
  next()
}


export default userActivator