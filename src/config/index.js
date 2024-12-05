import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.join(process.cwd(), '.env')
})

const config = {
  node_env: process.env.NODE_ENV,
  server_port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expiresin: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expiresin: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
  gmail_app_user: process.env.GMAIL_APP_USER,
  gmail_app_password: process.env.GMAIL_APP_PASSWORD,
  question_count: process.env.QUESTION_COUNT,
  xp_calculation_kfactor: process.env.XP_CALCULATION_KFACTOR,
  min_xp_adjustment: process.env.MIN_XP_ADJUSTMENT,
  max_xp_adjustment: process.env.MAX_XP_ADJUSTMENT
  //   server_base_url: process.env.SERVER_BASE_URL,
  //   admin_dashboard_url: process.env.ADMIN_DASHBOARD_URL,
}

export default config
