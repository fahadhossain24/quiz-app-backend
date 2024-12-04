import mongoose from 'mongoose'

const universitySchema = new mongoose.Schema({
  name: String,
})

const University = mongoose.model('university', universitySchema)
export default University;
