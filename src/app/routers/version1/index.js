import express from 'express'
import userRouter from '../../modules/userModule/user.routes.js'
import authRoute from '../../modules/authModule/auth.routes.js'
import questionRouter from '../../modules/questionModules/question/question.routes.js'
import specialityRouter from '../../modules/specialityModule/speciality.routes.js'
import sponsorRouter from '../../modules/sponsorModule/sponsor.routes.js'
import privacyPolicyRouter from '../../modules/privacyPolicyModule/privacyPolicy.routes.js'
import termsConditionRouter from '../../modules/termsConditionModule/termsCondition.routes.js'
import infoRouter from '../../modules/infoModeModule/info.routes.js'

const router = express.Router()

router.use('/user', userRouter)
router.use('/auth', authRoute)
router.use('/question', questionRouter)
router.use('/speciality', specialityRouter)
router.use('/sponsor', sponsorRouter)
router.use('/privacy-policy', privacyPolicyRouter)
router.use('/terms-condition', termsConditionRouter)
router.use('/info', infoRouter)

export default router
