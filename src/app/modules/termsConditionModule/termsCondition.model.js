import mongoose from 'mongoose'

const termsConditionSchema = new mongoose.Schema(
  {
    termsCondition: String,
  },
  {
    timestamps: true
  }
)

const TermsCondition = mongoose.model('termsCondition', termsConditionSchema)

export default TermsCondition
