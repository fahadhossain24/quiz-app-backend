import PrivacyPolicy from './privacyPolicy.model.js'

// service to create new privacy policy
const createPrivacyPolicy = async (data) => {
  return await PrivacyPolicy.create(data)
}

// service to get privacy policy
const getPrivacyPolicy = async () => {
  return await PrivacyPolicy.findOne({})
}

// service to get privacy policy
const getSpecificPrivacyPolicy = async (id) => {
  return await PrivacyPolicy.findOne({_id: id})
}

// service to update privacy policy
const updatePrivacyPolicy = async (id, data) => {
  return await PrivacyPolicy.updateOne({_id: id}, data, {
    runValidators: true
  })
}

export default {
  createPrivacyPolicy,
  getPrivacyPolicy,
  getSpecificPrivacyPolicy,
  updatePrivacyPolicy
}
