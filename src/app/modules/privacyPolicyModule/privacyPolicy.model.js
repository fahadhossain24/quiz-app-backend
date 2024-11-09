import mongoose from 'mongoose'

const privacyPolicySchema = new mongoose.Schema(
  {
    privacyPolicy: String,
  },
  {
    timestamps: true
  }
)

const PrivacyPolicy = mongoose.model('privacyPolicy', privacyPolicySchema)

export default PrivacyPolicy
