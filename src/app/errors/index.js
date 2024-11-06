import BadRequestError from "./error.badRequest.js";
import ForbiddenError from "./error.forbidden.js";
import NotFoundError from "./error.notFound.js";
import UnAuthorizedError from "./error.unAuthorized.js";

const CustomError = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnAuthorizedError
}

export default CustomError
