import express from 'express'
import userRouter from '../../modules/userModule/user.routes.js'
import authRoute from '../../modules/authModule/auth.routes.js'

const router = express.Router()

router.use('/user', userRouter)
router.use('/auth', authRoute)

export default router
