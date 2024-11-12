import jwt from 'jsonwebtoken'

const createToken = (payload, secret, expireTime) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireTime
  })
  return token
}

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret)
}

const jwtHelpers = {
  createToken,
  verifyToken
}

export default jwtHelpers
