import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/error_handler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internet server Error";

  console.log(
    "////////////////////////////////////\n+++ connection error +++\n message: " +
      err.message +
      "\n status code: " +
      err.statusCode +
      "\n name: " +
      err.name +
      "\n////////////////////////////"
  );

  // /wrong mongodb id
  if (err.name === "CastError") {
    const message = `Resource not found, Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // duplicate key error
  else if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  else if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // expired jwt
  else if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, try again`;
    err = new ErrorHandler(message, 400);
  } else {
    err = new ErrorHandler(err.message, err.statusCode);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
