export const successHandler = (req, res, next) => {
  // Implement the 'success' method of the response object
  res.success = (data, statusCode = 200, message = 'Success', isGet = false) => {
    // Send the JSON response
    if (isGet) {
      res.status(statusCode).json(data);
    } else {
      res.status(statusCode).json({
        success: true,
        message: message,
        timestamp: new Date().toISOString(),
        data: data,
      });
    }
  };
  next();
};
