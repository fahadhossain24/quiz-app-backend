import mongoose from 'mongoose'

const adAandSponsorImpressionSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    adId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    sponsorId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
  },
  {
    timestamps: true
  }
)

const AdAndSponsorImpression = mongoose.model('adAndSponsorImpression', adAandSponsorImpressionSchema)

export default AdAndSponsorImpression
