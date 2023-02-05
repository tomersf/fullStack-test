import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction, Errback } from "express";
import { CustomAPIError, NotFoundError } from "../errors";
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
  console.log(err)
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: err.message });
}
export default errorHandlerMiddleware;
