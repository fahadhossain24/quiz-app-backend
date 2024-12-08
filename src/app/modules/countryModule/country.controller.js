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
  const BATCH_SIZE = 10; // Reduce batch size for debugging (process 10 countries at a time)

  try {
    console.log('Starting to fetch countries data from API...');

    const response = await Promise.race([
      fetch('https://restcountries.com/v3.1/all'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeoutDuration)
      ),
    ]);

    if (!response.ok) {
      throw new Error(`Failed to fetch countries. Status: ${response.status}`);
    }

    const countries = await response.json();
    console.log(`Fetched ${countries.length} countries.`);

    // Log memory usage before processing
    console.log('Memory before processing:', process.memoryUsage());

    // Break countries into batches
    const countryPromises = [];
    for (let i = 0; i < countries.length; i += BATCH_SIZE) {
      const batch = countries.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

      const batchPromises = batch.map((country) => {
        const payload = {
          common: country.name.common,
          shortName: country.cioc,
          flagUrl: country.flags.png,
        };
        const newCountry = new Country(payload);
        return newCountry.save();
      });

      countryPromises.push(Promise.all(batchPromises)); // Process each batch sequentially
    }

    // Wait for all batches to complete
    await Promise.all(countryPromises);

    // Log memory usage after processing
    console.log('Memory after processing:', process.memoryUsage());

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Country insert successful!',
    });
  } catch (error) {
    console.error('Error while inserting countries:', error.message);
    console.error('Error Stack:', error.stack); // Log stack trace for better debugging
    console.error('Memory Usage:', process.memoryUsage()); // Log memory usage at the time of failure
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
