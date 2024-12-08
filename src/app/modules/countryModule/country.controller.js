import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../../shared/sendResponse.js'
import Country from './country.model.js'
import axios from 'axios'
import CustomError from '../../errors/index.js'
import University from './university.model.js'

const insertCountry = async (req, res) => {
  try {
    // Fetch countries from the World Bank API
    const response = await axios.get('https://api.worldbank.org/v2/country?format=json')

    // Check if the response is valid
    if (!response.data || !Array.isArray(response.data[1])) {
      throw new CustomError.BadRequestError('Failed to retrieve countries data!')
    }

    const countries = response.data[1]

    // Map over the countries to prepare payload for insertion
    const countryPromises = countries.map((country) => {
      const { id, name } = country // Extract country code (id) and name

      // Flag URL mapping (you can use any service to map the country code to a flag image URL)
      const flagUrl = `https://flagcdn.com/w320/${id.toLowerCase()}.png` // Example flag URL using country code

      const payload = {
        common: name, // Full country name
        shortName: id, // Country short name (code)
        flagUrl: flagUrl // Flag URL
      }

      const newCountry = new Country(payload)
      return newCountry.save()
    })

    // Wait for all country data to be saved in parallel
    await Promise.all(countryPromises)

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Countries added successfully!'
    })
  } catch (error) {
    console.error(error)
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: 'error',
      message: `An error occurred while inserting countries: ${error.message}`
    })
  }
}

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
    timeout: 15000 // Set timeout to 10 seconds or adjust as needed
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
