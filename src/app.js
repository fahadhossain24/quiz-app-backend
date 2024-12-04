import express from 'express'
import 'express-async-errors'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import fileUpload from 'express-fileupload'
import globalErrorHandler from './app/middlewares/globalErrorHandler.js'
import notFound from './app/middlewares/notFound.js'
import router from './app/routers/version1/index.js'
import { StatusCodes } from 'http-status-codes'
import sendResponse from './shared/sendResponse.js'
import cookieParser from 'cookie-parser'
import s3Upload from './app/middlewares/s3FileUploader.js'

const app = express()

// global middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload())
app.use('/v1/uploads', express.static(path.join('uploads')))

const limiter = rateLimit({
  max: 150,
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: 'Too many attempts from your IP. Please retry in 15 minutes'
})

app.use(morgan('dev'))
// app.use(limiter)

// app.post('/v1/upload/multiple', s3Upload('file', false), (req, res) => {
//   console.log("Request body:", req.body); // Debugging log
//   console.log("Request files:", req.files); // Debugging log

//   if (!req.files || !req.files.file) {
//       return res.status(400).json({ message: 'No files uploaded' });
//   }

//   const files = req.files.file.map(file => file.location);
//   res.status(200).json({
//       message: 'Files uploaded successfully',
//       files,
//   });
// });


// application middleware
app.use('/v1', router)

app.get('/health_check', (req, res) => {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Server is working'
  })
})



// error handling middlewares
app.use(globalErrorHandler)
app.use(notFound)

export default app
