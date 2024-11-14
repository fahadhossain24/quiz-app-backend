import mongoose from 'mongoose'
import config from './config/index.js'
import app from './app.js'
import http from 'http'
import {Server} from 'socket.io'
const port = 5005;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
     methods: ['GET', 'POST'],
  }
})

// io.on('connection', (socket) => {
//   console.log("new user connected")
//   socket.on('d', (msg) => {
//     console.log(msg)
//     socket.emit('d', {msg})
//   })
// })

const dbConnection = async () => {
  mongoose.connect(config.database_url)
  console.log('database connection successfull')
  server.listen(port || config.server_port, () => {
    console.log('server is listing on port', port || config.server_port)
  })

}

dbConnection()

export default io
