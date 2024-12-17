import mongoose from 'mongoose';

const specialitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    conditions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'condition'
      }
    ],
    // condition1: {
    //     name: {
    //         type: String,
    //     },
    //     pdf: {
    //         type: String,
    //     }
    // },
    // condition2: {
    //     name: {
    //         type: String,
    //     },
    //     pdf: {
    //         type: String,
    //     }
    // },
    // condition3: {
    //     name: {
    //         type: String,
    //     },
    //     pdf: {
    //         type: String,
    //     }
    // },
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
