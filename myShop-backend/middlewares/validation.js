// Validate the Joi schema
export const validateSchema = (schema, req, res, next) => {
  // `abortEarly: false` to avoid stopping at the first error, allowing all errors to be reported
  const { error } = schema.validate(req.body, { abortEarly: false });

  // Send the validation error
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      timestamp: new Date().toISOString(),
      errors: error.details.map((e) => e.message),
    });
  }

  // Validation successful: proceed to the next middleware or the controller
  next();
};
