import logger from "../monitoring/logger.js";
import {ApiError} from "../response/ApiError.js"

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch((error) => {
                logger.error({message: error.message, stack: error.stack});
                const apiError = error instanceof ApiError 
                    ? error
                    : new ApiError(500, "Internal Server Error");
                
                next(apiError);
            });
    }
}