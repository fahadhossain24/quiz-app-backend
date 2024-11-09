import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import privacyPolicyServices from './privacyPolicy.services.js'
import CustomError from '../../errors/index.js'

// controller for create new privacy policy
const createPrivacyPolicy = async (req, res) => {
  const data = req.body
  if (!data) {
    throw new CustomError.BadRequestError('Missing data in request body!')
  }

  const existingPrivacyPolicy = await privacyPolicyServices.getPrivacyPolicy()

  if (existingPrivacyPolicy) {
    throw new CustomError.BadRequestError('You already have privacy policy!')
  }

  const privacyPolicy = await privacyPolicyServices.createPrivacyPolicy(data)

  if (!privacyPolicy) {
    throw new CustomError.BadRequestError(
      'Failed to create new privacy policy!'
    )
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'New privacy policy added successfull!',
    data: privacyPolicy
  })
}

// controller for get privacy policy
const getPrivacyPolicy = async (req, res) => {
  const privacyPolicy = await privacyPolicyServices.getPrivacyPolicy()

  if (!privacyPolicy) {
    throw new CustomError.BadRequestError('No privacy policy found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Privacy policy retrive successfull!',
    data: privacyPolicy
  })
}

// controller for update privacy policy
const updatePrivacyPolicy = async (req, res) => {
  const { id } = req.params
  const data = req.body

  const privacyPolicy = await privacyPolicyServices.getSpecificPrivacyPolicy(id)

  if (!privacyPolicy) {
    throw new CustomError.BadRequestError('No privacy policy found!')
  }

  const updatedPrivacyPolicy = await privacyPolicyServices.updatePrivacyPolicy(
    id,
    data
  )

  if (!updatedPrivacyPolicy.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update privacy policy!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Privacy policy update successfull!'
  })
}

export default {
  createPrivacyPolicy,
  getPrivacyPolicy,
  updatePrivacyPolicy
}
