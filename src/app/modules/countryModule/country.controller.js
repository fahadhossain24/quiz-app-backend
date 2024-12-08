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
  const timeoutDuration = 15000; // Timeout duration in milliseconds (15 seconds)

  try {
    // Log start of the process
    console.log('Starting to fetch countries data from API...');

    // Create a fetch request with a timeout using Promise.race
    const response = await Promise.race([
      fetch('https://restcountries.com/v3.1/all'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeoutDuration)
      ),
    ]);

    // Check if the fetch response is ok
    if (!response.ok) {
      throw new Error(`Failed to fetch countries. Status: ${response.status}`);
    }

    // Log API response success
    console.log('Countries data fetched successfully.');

    const countries = await response.json();  // Parse the response body as JSON

    // Check if the response contains countries and log the length of the array
    console.log(`Received ${countries.length} countries from the API.`);

    // Validate data before inserting
    const validCountries = countries.filter((country) => {
      return (
        country.name?.common &&
        country.cioc &&
        country.flags?.png
      );
    });

    // Log if there are invalid countries
    console.log(`${countries.length - validCountries.length} countries skipped due to invalid data.`);

    // If no valid countries, throw an error
    if (validCountries.length === 0) {
      throw new Error('No valid country data to insert');
    }

    // Create and save country records
    const countryPromises = validCountries.map((country) => {
      const payload = {
        common: country.name.common,
        shortName: country.cioc,
        flagUrl: country.flags.png,
      };
      const newCountry = new Country(payload);
      return newCountry.save(); // Save to database
    });

    // Wait for all country insertions to complete
    await Promise.all(countryPromises);

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Country insert successful!',
    });
  } catch (error) {
    // Log the detailed error message
    console.error('Error while inserting countries:', error.message);

    // Send failure response with detailed error message
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: 'error',
      message: `An error occurred while inserting countries: ${error.message}`,
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
