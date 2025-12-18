const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error(err);  // You can log the error or send it to a logging service
    res.status(statusCode).send({
      success: false,
      error: message,
    });
  };
  
  export default errorHandler;
  