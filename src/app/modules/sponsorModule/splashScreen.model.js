import mongoose from 'mongoose'

const splashScreenSchema = new mongoose.Schema(
  {
    image: String,
    status: {
      type: Boolean,
      default: true
    },
    impressionCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const SplashScreen = mongoose.model('splashScreen', splashScreenSchema)

export default SplashScreen
