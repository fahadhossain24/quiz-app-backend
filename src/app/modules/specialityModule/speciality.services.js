import Speciality from './speciality.model.js'

// service for create new speciality
const createSpeciality = async (data) => {
  return await Speciality.create(data)
}

// service for get specific speciality
const getAllSpeciality = async () => {
  return await Speciality.find()
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

// service for update single speciality condition
const updateSingleSpecialityCondition = async (id, conditionData) => {
  return await Speciality.findByIdAndUpdate(
    id,
    {
      $set: {
        [`condition${parseInt(conditionData.identifier)}.name`]: conditionData.name,
        [`condition${parseInt(conditionData.identifier)}.pdf`]: conditionData.pdf || null
      }
    },
    { new: true, runValidators: true }
  )
}

// service for delete specific speciality
const deleteSpecificSpeciality = async (id) => {
  return await Speciality.deleteOne({ _id: id })
}

export default {
  createSpeciality,
  getAllSpeciality,
  getSpecificSpeciality,
  updateSpecificSpeciality,
  updateSingleSpecialityCondition,
  deleteSpecificSpeciality
}
