import mongoose from 'mongoose'

const countrySchema = new mongoose.Schema({
  common: {
    type: String,
    required: true
  },
  shortName: String,
  flagUrl: String,
})

const Country = mongoose.model('country', countrySchema)
export default Country;
