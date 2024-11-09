import mongoose from 'mongoose'

const splashScreenSchema = new mongoose.Schema(
  {
    image: String,
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

const SplashScreen = mongoose.model('splashScreen', splashScreenSchema)

export default SplashScreen
