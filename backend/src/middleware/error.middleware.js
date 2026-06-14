import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // Sequelize bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  // Sequelize duplicate key
  if (err.name === "SequelizeUniqueConstraintError") {
    const message = "Duplicate field value entered";
    error = new ApiError(400, message);
  }

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
