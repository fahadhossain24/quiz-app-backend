import express from 'express'
import userRouter from '../../modules/userModule/user.routes.js'

const router = express.Router()

router.use('/user', userRouter)
// router.use('/auth', authRoute)

export default router
