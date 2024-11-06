import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../shared/sendResponse.js';

const requestValidator = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
            cookies: req.cookies,
        });

        if (!result.success) {
            sendResponse(res, {
                statusCode: StatusCodes.BAD_REQUEST,
                status: "failed",
                message: "Request validation error!",
                data: result.error.errors
            })
        }

        return next();
    };
};

export default requestValidator;
