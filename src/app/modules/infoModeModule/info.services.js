import Info from './info.model.js';

// service to create new info
const createInfo = async (data) => {
  return await Info.create(data);
};

// service to get all info
const getAllInfo = async () => {
  return await Info.find({});
};

// service to get specific info by ID
const getSpecificInfo = async (id) => {
  return await Info.findOne({ _id: id });
};

// service to update info
const updateInfo = async (id, data) => {
  return await Info.updateOne({ _id: id }, data, {
    runValidators: true
  });
};

// service to delete info
const deleteInfo = async (id, data) => {
  return await Info.deleteOne({ _id: id }, data, {
    runValidators: true
  });
};

export default {
  createInfo,
  getAllInfo,
  getSpecificInfo,
  updateInfo,
  deleteInfo
};
