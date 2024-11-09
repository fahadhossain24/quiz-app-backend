import mongoose from 'mongoose'

const infoSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true
  }
)

const Info = mongoose.model('info', infoSchema)

export default Info
