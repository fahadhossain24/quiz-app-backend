import { StatusCodes } from "http-status-codes"

class ForbiddenError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}

export default ForbiddenError
