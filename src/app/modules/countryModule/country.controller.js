import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import Country from './country.model.js'
import axios from 'axios'
import CustomError from '../../errors/index.js'
import University from './university.model.js'

// const insertCountry = async (req, res) => {
//   const response = await axios.get('https://restcountries.com/v3.1/all', {
//     timeout: 15000, // Set timeout to 10 seconds or adjust as needed
//   })
//   const countries = response.data

//   const countryPromises = countries.map((country) => {
//     const payload = {
//       common: country.name.common,
//       shortName: country.cioc,
//       flagUrl: country.flags.png
//     }
//     const newCountry = new Country(payload)
//     return newCountry.save()
//   })

//   await Promise.all(countryPromises)

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     status: 'success',
//     message: 'Country insert successfull!'
//   })
// }

const insertCountry = async (req, res) => {
  try {
    // Using native fetch API to get the countries
    const response = await fetch('https://restcountries.com/v3.1/all', {
      method: 'GET',
      timeout: 15000, // Set timeout to 15 seconds (fetch doesn't support timeout natively, so we'll need to handle that manually)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const countries = await response.json();  // Parse the response body as JSON

    const countryPromises = countries.map((country) => {
      const payload = {
        common: country.name.common,
        shortName: country.cioc,
        flagUrl: country.flags.png,
      };
      const newCountry = new Country(payload);
      return newCountry.save();
    });

    await Promise.all(countryPromises);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Country insert successful!',
    });
  } catch (error) {
    console.error('Error while inserting countries:', error.message);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: 'error',
      message: 'An error occurred while inserting countries.',
    });
  }
};


const getCountries = async (req, res) => {
  const countries = await Country.find().select('-_id -__v')

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Countries retrive successfull!',
    data: countries
  })
}

const insertUniversity = async (req, res) => {
  const response = await axios.get(`http://universities.hipolabs.com/search`, {
    timeout: 15000, // Set timeout to 10 seconds or adjust as needed
  })

  // If no universities are found, handle it
  if (response.data.length === 0) {
    throw new CustomError.BadRequestError('No universities found!')
  }
  // console.log(response.data)
  const universityPromises = response.data.map((universityData) => {
    const { name } = universityData // Extract university name from API response

    const newUniversity = new University({
      name
    })

    return newUniversity.save()
  })

  await Promise.all(universityPromises)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: `Universities for added successfully!`
  })
}

const searchUniversity = async (req, res) => {
  const { query } = req.query

  // If no query is provided, return all universities
  if (!query) {
    const universities = await University.find().select('-__v')
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Universities retrieved successfully!',
      data: universities
    })
  }

  // Case-insensitive partial search for universities by name
  const universities = await University.find({
    name: { $regex: query, $options: 'i' } 
  }).select('-__v')

  if (universities.length === 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      status: 'fail',
      message: 'No universities found matching the query.',
      data: []
    })
  }

  return sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'University search successful!',
    data: universities
  })
}

export default {
  insertCountry,
  getCountries,
  insertUniversity,
  searchUniversity
}
