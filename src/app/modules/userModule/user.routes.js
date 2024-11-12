import express from 'express'
import requestValidator from '../../middlewares/requestValidator.js'
import UserValidationZodSchema from './user.validation.js'
import userControllers from './user.controllers.js'
// const authorization = require('../../middlewares/authorization')

const userRouter = express.Router()

// userRouter.use(authorization('admin'))

// create user
userRouter.post(
  '/create',
  requestValidator(UserValidationZodSchema.createUserZodSchema),
  userControllers.createUser
)

// find opponents
userRouter.get('/search', userControllers.findOpponent)

// get specific user
userRouter.get('/:id', requestValidator(UserValidationZodSchema.getSpecificUserZodSchema), userControllers.getSpecificUser)

// delete specific user
userRouter.delete('/delete/:id', requestValidator(UserValidationZodSchema.getSpecificUserZodSchema), userControllers.deleteSpecificUser)

// update specific user
userRouter.patch('/update/:id', userControllers.updateSpecificUser)

// change profile image of specific user
userRouter.patch('/update/profile-picture/:id', userControllers.changeUserProfileImage)

export default userRouter
