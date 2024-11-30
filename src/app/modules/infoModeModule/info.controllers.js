import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse.js';
import infoServices from './info.services.js';
import CustomError from '../../errors/index.js';

// controller for creating new info
const createInfo = async (req, res) => {
  const data = req.body;
  if (!data) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const info = await infoServices.createInfo(data);

  if (!info) {
    throw new CustomError.BadRequestError('Failed to create new info!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'New info added successfully!',
    data: info
  });
};

// controller for getting all info
const getSpecificInfo = async (req, res) => {

  const {id} = req.params
  const info = await infoServices.getSpecificInfo(id);

  if (!info) {   
    throw new CustomError.BadRequestError('No info found!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Info retrieved successfully!',
    data: info
  });
};

// controller for getting all info
const getAllInfo = async (req, res) => {
  console.log('hitted')
  const infoList = await infoServices.getAllInfo();

  // if (!infoList.length === 0) {   
  //   throw new CustomError.BadRequestError('No info found!');
  // }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Info retrieved successfully!',
    data: infoList
  });
};

// controller for updating info
const updateInfo = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const info = await infoServices.getSpecificInfo(id);

  if (!info) {
    throw new CustomError.BadRequestError('No info found!');
  }

  const updatedInfo = await infoServices.updateInfo(id, data);

  if (!updatedInfo.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update info!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Info updated successfully!'
  });
};

// controller for delete info
const deleteInfo = async (req, res) => {
  const { id } = req.params;

  const info = await infoServices.getSpecificInfo(id);

  if (!info) {
    throw new CustomError.BadRequestError('No info found!');
  }

  const deletedInfo = await infoServices.deleteInfo(id);

  if (!deletedInfo.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete info!');
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Info deleted successfull!'
  });
};

export default {
  createInfo,
  getSpecificInfo,
  getAllInfo,
  updateInfo,
  deleteInfo
};
