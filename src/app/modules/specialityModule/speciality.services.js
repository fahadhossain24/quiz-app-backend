import Speciality from './speciality.model.js'

// service for create new speciality
const createSpeciality = async (data) => {
  return await Speciality.create(data)
}

// service for get specific speciality
const getSpecificSpeciality = async (id) => {
  return await Speciality.findOne({ _id: id })
}

// service for update specific speciality
const updateSpecificSpeciality = async (id, data) => {
  return await Speciality.updateOne({ _id: id }, data, {
    runValidators: true
  })
}

// service for delete specific speciality
const deleteSpecificSpeciality = async (id) => {
  return await Speciality.deleteOne({ _id: id })
}

export default {
  createSpeciality,
  getSpecificSpeciality,
  updateSpecificSpeciality,
  deleteSpecificSpeciality
}
