import mongoose from 'mongoose';

const specialitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    condition1: {
        name: {
            type: String,
            required: true,
        },
        pdf: {
            type: String,
            required: true,
        }
    },
    condition2: {
        name: {
            type: String,
            required: true,
        },
        pdf: {
            type: String,
            required: true,
        }
    },
    condition3: {
        name: {
            type: String,
            required: true,
        },
        pdf: {
            type: String,
            required: true,
        }
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'disabled'],
      default: 'active'
    },
    image: {
      type: String,
      default: ''
    },
    
  },
  {
    timestamps: true
  }
)


const Speciality = mongoose.model('speciality', specialitySchema)

export default Speciality
