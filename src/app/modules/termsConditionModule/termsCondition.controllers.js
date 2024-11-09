import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse.js';
import termsConditionServices from './termsCondition.services.js';
import CustomError from '../../errors/index.js';

// controller for creating new terms and condition
const createTermsCondition = async (req, res) => {
  const data = req.body;
  if (!data) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const existingTermsCondition = await termsConditionServices.getTermsCondition();

  if (existingTermsCondition) {
    throw new CustomError.BadRequestError('You already have terms and condition!');
  }

  const termsCondition = await termsConditionServices.createTermsCondition(data);

  if (!termsCondition) {
    throw new CustomError.BadRequestError('Failed to create new terms and condition!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'New terms and condition added successfully!',
    data: termsCondition
  });
};

// controller for getting terms and condition
const getTermsCondition = async (req, res) => {
  const termsCondition = await termsConditionServices.getTermsCondition();

  if (!termsCondition) {
    throw new CustomError.BadRequestError('No terms and condition found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Terms and condition retrieved successfully!',
    data: termsCondition
  });
};

// controller for updating terms and condition
const updateTermsCondition = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const termsCondition = await termsConditionServices.getSpecificTermsCondition(id);

  if (!termsCondition) {
    throw new CustomError.BadRequestError('No terms and condition found!');
  }

  const updatedTermsCondition = await termsConditionServices.updateTermsCondition(id, data);

  if (!updatedTermsCondition.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update terms and condition!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Terms and condition updated successfully!'
  });
};

export default {
  createTermsCondition,
  getTermsCondition,
  updateTermsCondition
};
