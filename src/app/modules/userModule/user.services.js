import User from './user.model.js'

// service for create new user
const createUser = async (data) => {
  return await User.create(data)
}

// service for get specific user
const getUsers = async (filter) => {
  console.log(filter)
  return await User.find(filter).select('-password -verification')
}

// service for get specific user
const getSpecificUser = async (id) => {
  return await User.findOne({ _id: id }).select('-password')
}

// service for update specific user
const updateSpecificUser = async (id, data) => {
  return await User.updateOne({ _id: id }, data, {
    runValidators: true
  })
}

// service for delete specific user
const deleteSpecificUser = async (id) => {
  return await User.deleteOne({ _id: id })
}

// service for find user(opponent)
const searchOpponent = async (searchCriteria) => {
  return await User.find(searchCriteria).select('-password -verification');
}

export default {
  createUser,
  getUsers,
  getSpecificUser,
  updateSpecificUser,
  deleteSpecificUser,
  searchOpponent,
}
