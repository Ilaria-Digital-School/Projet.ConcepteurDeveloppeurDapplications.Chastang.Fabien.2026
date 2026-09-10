export const errorHandler = (err, req, res, next) => {
  // Display the detailed error in the console
  console.error(err);

  // Send the JSON response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
};
