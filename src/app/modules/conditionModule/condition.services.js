import Condition from './condition.model.js'

// service for create condition
const createCondition = async (data) => {
  return await Condition.create(data)
}

// service for update specific condition
const updateSpecificCondition = async (id, data) => {
  return await Condition.updateOne({ _id: id }, data, {
    runValidators: true
  })
}

// service for delete specific condition
const deleteSpecificCondition = async (id) => {
  return await Condition.deleteOne({ _id: id })
}

export default {
  createCondition,
  updateSpecificCondition,
  deleteSpecificCondition
}
