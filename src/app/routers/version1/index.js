import express from 'express'
import userRouter from '../../modules/userModule/user.routes.js'
import authRoute from '../../modules/authModule/auth.routes.js'
import questionRouter from '../../modules/questionModules/question/question.routes.js'
import specialityRouter from '../../modules/specialityModule/speciality.routes.js'
import sponsorRouter from '../../modules/sponsorModule/sponsor.routes.js'
import privacyPolicyRouter from '../../modules/privacyPolicyModule/privacyPolicy.routes.js'
import termsConditionRouter from '../../modules/termsConditionModule/termsCondition.routes.js'
import infoRouter from '../../modules/infoModeModule/info.routes.js'
import quizRouter from '../../modules/quizModules/quiz/quiz.routes.js'
import quizSessionRouter from '../../modules/quizModules/quizSession/quizSession.routes.js'
import matchHistoryRouter from '../../modules/quizModules/matchHistory/matchHistory.routes.js'
import friendsRouter from '../../modules/friendModule/friend.routes.js'
import leaderboardRouter from '../../modules/leaderboardModule/leaderboard.routes.js'
import questionHistoryRouter from '../../modules/questionModules/questionHistory/questionHistory.routes.js'
import reviewModeRouter from '../../modules/reviewModeModule/reviewMode.routes.js'
import dashboardRouter from '../../modules/dashboard/dashboard.routes.js'
import adminRouter from '../../modules/adminModule/admin.routes.js'

const router = express.Router()

router.use('/user', userRouter)
router.use('/auth', authRoute)
router.use('/question', questionRouter)
router.use('/friend', friendsRouter)
router.use('/quiz', quizRouter)
router.use('/quiz-session', quizSessionRouter)
router.use('/leaderboard', leaderboardRouter)
router.use('/match-history', matchHistoryRouter)
router.use('/question-history', questionHistoryRouter)
router.use('/review-mode', reviewModeRouter)
router.use('/speciality', specialityRouter)
router.use('/sponsor', sponsorRouter)
router.use('/privacy-policy', privacyPolicyRouter)
router.use('/terms-condition', termsConditionRouter)
router.use('/info', infoRouter)
router.use('/dashboard', dashboardRouter)
router.use('/admin', adminRouter)

export default router
