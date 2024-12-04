import mongoose from 'mongoose'

const adsSchema = new mongoose.Schema(
  {
    content: String,
    status: {
      type: Boolean,
      default: true
    },
    showing_period: String,
    impressionCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const Ads = mongoose.model('ads', adsSchema)

export default Ads
