import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import CustomError from '../../errors/index.js'
import Speciality from '../specialityModule/speciality.model.js'
import conditionServices from './condition.services.js'
import fileUploader from '../../../utils/fileUploader.js'
import Condition from './condition.model.js'

// controller for create condition
const createCondition = async (req, res) => {
  const conditionData = req.body
  // console.log(req.body)
  if (req.files && req.files.pdf) {
    const pdfPath = await fileUploader(req.files, `condition-image-${conditionData.name}`, 'pdf')
    conditionData.pdf = pdfPath
  }

  // Check if speciality exists
  const speciality = await Speciality.findOne({ _id: conditionData.specialityId })
  if (!speciality) {
    throw new CustomError.BadRequestError('Invalid speciality Id!')
  }

  // Create the condition
  const condition = await conditionServices.createCondition(conditionData)
  if (!condition) {
    throw new CustomError.BadRequestError('Failed to create new condition!')
  }

  // Add the condition to the speciality's conditions array
  if (!speciality.conditions.includes(condition._id)) {
    speciality.conditions.push(condition._id)
  }

  // Save the speciality document after updating conditions
  await speciality.save()

  // Return response with the created condition
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Condition created successfully!',
    data: condition
  })
}

// controller for update specific condition
const updateCondition = async (req, res) => {
  const { id } = req.params
  const conditionData = req.body
  if (!id) {
    throw new CustomError.BadRequestError('missing id in request params!')
  }

  if (req.files && req.files.pdf) {
    const pdfPath = await fileUploader(req.files, `condition-image-${conditionData.name}`, 'pdf')
    conditionData.pdf = pdfPath
  }

  const updatedCondition = await conditionServices.updateSpecificCondition(id, conditionData)
  if (!updatedCondition.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update condition!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Condition updated successfully!'
  })
}

// controller for delete specific condition
const deleteCondition = async (req, res) => {
  const { id } = req.params

  const condition = await Condition.findOne({ _id: id })
  if (!condition) {
    throw new CustomError.BadRequestError('No condition found!')
  }

  const speciality = await Speciality.findOne({ _id: condition.specialityId })

  const existingCoditions = speciality.conditions.filter(conditionId => conditionId.toString() !== id)
  speciality.conditions = existingCoditions
  await speciality.save()

  const deletedCondition = await conditionServices.deleteSpecificCondition(id)
  if (!deletedCondition.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete condition!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Condition delete successfully!'
  })
}

export default {
  createCondition,
  updateCondition,
  deleteCondition
}
