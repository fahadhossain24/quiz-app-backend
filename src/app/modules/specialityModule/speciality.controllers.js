import { StatusCodes } from 'http-status-codes'
import CustomError from '../../errors/index.js'
import specialityServices from './speciality.services.js'
import fileUploader from '../../../utils/fileUploader.js'
import sendResponse from '../../../shared/sendResponse.js'

// controller for create new speciality
const createSpeciality = async (req, res) => {
  const specialityData = req.body
  if (req.files || req.files.image) {
    const imagePath = await fileUploader(
      req.files,
      `speciality-image-${specialityData.name}`,
      'image'
    )
    specialityData.image = imagePath
  }

  const conditionNames = ['condition1', 'condition2', 'condition3']

  // Use Promise.all to upload all condition PDFs in parallel
  const pdfUploadPromises = conditionNames.map(async (conditionName) => {
    const conditionKey = `${conditionName}.name` // Form key for the name of the condition
    const pdfKey = `${conditionName}.pdf` // Form key for the PDF file

    if (req.files && req.files[`${conditionName}.pdf`]) {
      // Check if PDF is uploaded for the condition
      const pdfPath = await fileUploader(
        req.files,
        `${conditionName}-${specialityData[conditionKey]}-pdf-of-${specialityData.name}`,
        `${conditionName}.pdf`
      )

      if (!specialityData[conditionName]) {
        specialityData[conditionName] = {}
      }

      // Set the PDF path dynamically
      specialityData[conditionName].pdf = pdfPath

      // Set the name for the condition dynamically (if provided in the form data)
      specialityData[conditionName].name = specialityData[conditionKey]
    } else {
      // If no PDF is uploaded, set the PDF to null for the condition
      specialityData[conditionName] = {
        ...specialityData[conditionName],
        pdf: null
      }
    }
  })

  // Wait for all PDFs to be uploaded
  await Promise.all(pdfUploadPromises)

  const speciality = await specialityServices.createSpeciality(specialityData)
  if (!speciality) {
    new CustomError.BadRequestError('Failed to create new speciality!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'New speciality created successfully!',
    data: speciality
  })
}

// controller for get all specialities
const getAllSeciality = async (req, res) => {
  const specialities = await specialityServices.getAllSpeciality()
  // if (specialities.length === 0) {
  //   throw new CustomError.BadRequestError('No specialities found!')
  // }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Specialities retrive successfull!',
    data: specialities
  })
}

// controller for get specific speciality
const getSpecificSeciality = async (req, res) => {
  const { id } = req.params
  if (!id) {
    throw new CustomError.BadRequestError('Missing id in request params!')
  }

  const speciality = await specialityServices.getSpecificSpeciality(id)
  if (!speciality) {
    throw new CustomError.BadRequestError('No speciality found!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Speciality retrive successfully!',
    data: speciality
  })
}

// controller for update specific speciality
// const updateSpeciality = async (req, res) => {
//   const { id } = req.params
//   const data = req.body

//   const speciality = await specialityServices.getSpecificSpeciality(id)
//   if (!speciality) {
//     throw new CustomError.BadRequestError('No speciality found!')
//   }

//   const updatedSpeciality = await specialityServices.updateSpecificSpeciality(
//     id,
//     data
//   )
//   if (!updatedSpeciality.modifiedCount) {
//     throw new CustomError.BadRequestError('Failed to update speciality!')
//   }

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     status: 'success',
//     message: 'Speciality modified successfull!'
//   })
// }

// controller for modify speciality without conditions
const modifySpeciality = async (req, res) => {
  const { id } = req.params
  const specialityData = req.body

  const speciality = await specialityServices.getSpecificSpeciality(id)
  if (!speciality) {
    throw new CustomError.BadRequestError('No speciality found!')
  }

  if (req.files && req.files.image) {
    const imagePath = await fileUploader(
      req.files,
      `speciality-image-${specialityData.name}`,
      'image'
    )
    specialityData.image = imagePath
  }

  const updatedSpeciality = await specialityServices.updateSpecificSpeciality(
    id,
    specialityData
  )
  if (!updatedSpeciality.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update speciality!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Speciality modified successfull!'
  })
}

// controller for modify speciality without conditions
const modifyCondition = async (req, res) => {
  const { id } = req.params
  const conditionData = req.body

  if(!conditionData.identifier){
    throw new CustomError.BadRequestError('Missing identifier in request body. Please use 1, 2 or 3 as identifier!')
  }

  if(conditionData.identifier <= 0 && conditionData.identifier > 3){
    throw new CustomError.BadRequestError('Sorry, You are allowed to modify only 3 condition!')
  }

  const speciality = await specialityServices.getSpecificSpeciality(id)
  if (!speciality) {
    throw new CustomError.BadRequestError('No speciality found!')
  }

  // Check if a new PDF file for condition1 is provided
  if (req.files && req.files.pdf) {
    const pdfPath = await fileUploader(
      req.files,
      `condition1-${conditionData.name}-pdf-of-${speciality.name}`,
      'pdf'
    )

    conditionData.pdf = pdfPath
  }

  const updatedCondition =
    await specialityServices.updateSingleSpecialityCondition(id, conditionData)

  if (!updatedCondition.isModified) {
    throw new CustomError.BadRequestError('Failed to update condition!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Condition updated successfull!'
  })
}

// controller for delete specific speciality
const deleteSpeciality = async (req, res) => {
  const { id } = req.params

  const deletedSpeciality =
    await specialityServices.deleteSpecificSpeciality(id)
  if (!deletedSpeciality.deletedCount) {
    throw new CustomError.BadRequestError('Failed to delete speciality!')
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Speciality delete successfull!'
  })
}

export default {
  createSpeciality,
  getAllSeciality,
  getSpecificSeciality,
  modifySpeciality,
  modifyCondition,
  deleteSpeciality
}
