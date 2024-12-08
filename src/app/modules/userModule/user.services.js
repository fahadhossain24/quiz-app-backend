import User from './user.model.js'

// service for create new user
const createUser = async (data) => {
  return await User.create(data)
}

// service for get specific user
// const getUsers = async (filter) => {
//   return await User.find(filter).select('-password -verification')
// }
const getUsers = async (activeUsersIds) => {
  return await User.find({_id: {$in: activeUsersIds}}).select('-password -verification')
}
// service for get recent user
const getRecentUsers = async () => {
  return await User.find().sort('-createdAt').limit(5).select('-password -verification')
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
  getRecentUsers,
  getSpecificUser,
  updateSpecificUser,
  deleteSpecificUser,
  searchOpponent,
}
