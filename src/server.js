import mongoose from 'mongoose'
import config from './config/index.js'
import app from './app.js'
const port = 5005

const dbConnection = async () => {
  mongoose.connect(config.database_url)
  console.log('database connection successfull')
  app.listen(port || config.server_port, () => {
    console.log('server is listing on port', port || config.server_port)
  })
}

dbConnection()
