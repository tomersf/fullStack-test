import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction, Errback } from "express";
import { CustomAPIError, NotFoundError } from "../errors";
import { MONGODB_ERROR_NAMES } from "../helpers";
function errorHandlerMiddleware<T extends CustomAPIError | Error>(
  err: T,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (Object.getPrototypeOf(err) instanceof CustomAPIError) {
    return res
      .status((err as CustomAPIError).statusCode)
      .json({ msg: err.message });
  }
  switch (err.name) {
    case MONGODB_ERROR_NAMES.CastError:
      return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Invalid ID was given'})
    case MONGODB_ERROR_NAMES.ValidationError:
      return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Validations failed'})

    default:
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: err.message });
  }
}

export default errorHandlerMiddleware;
