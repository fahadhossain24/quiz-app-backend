import jwt from 'jsonwebtoken'
import CustomError from '../app/errors/index.js'

const createToken = (payload, secret, expireTime) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireTime
  })
  return token
}

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    throw new CustomError.UnAuthorizedError('Invalid token')
  }
}

const jwtHelpers = {
  createToken,
  verifyToken
}

export default jwtHelpers
