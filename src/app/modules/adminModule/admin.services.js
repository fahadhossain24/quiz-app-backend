import Admin from './admin.model.js'

// service for create new admin
const createAdmin = async (data) => {
  return await Admin.create(data)
}

// service for get all admin
const getAllAdmin = async () => {
  return await Admin.find().select('-password')
}

// service for get specific admin
const getSpecificAdmin = async (id) => {
  return await Admin.findOne({ _id: id }).select('-password')
}

// service for get specific admin by email
const getAdminByEmail = async (email) => {
  return await Admin.findOne({ email })
}

// service for update specific admin 
const updateSpecificAdmin = async (id, data) => {
  return await Admin.updateOne({ _id: id }, data, {
    runValidators: true
  })
}

// service for delete specific admin
const deleteSpecificAdmin = async (id) => {
  return await Admin.deleteOne({ _id: id })
}

export default {
  createAdmin,
  getAllAdmin,
  getSpecificAdmin,
  getAdminByEmail,
  updateSpecificAdmin,
  deleteSpecificAdmin
}
