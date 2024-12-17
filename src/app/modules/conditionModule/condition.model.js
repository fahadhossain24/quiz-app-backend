import mongoose from 'mongoose'

const conditionSchema = new mongoose.Schema(
  {
    specialityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'speciality',
        required: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    pdf: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const Condition = mongoose.model('condition', conditionSchema)

export default Condition
