import Joi from 'joi';

// Check if a value follows the format of a user reference
const REF_PATTERN = /^[A-Z0-9]{6}-[A-Z0-9]{6}$/;

// Check if a value follows the format of an URL
// const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const URL_PATTERN = /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6}))?([\/\w \.-]*)*\/?$/;

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddProd = (req, res, next) => {
  const Schema = Joi.object({
    reference: Joi.string().pattern(REF_PATTERN).required().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'any.required': 'The {{#label}} field is mandatory.',
      'string.pattern.base': 'Invalid {{#label}}.',
    }),
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field must be a date.',
    }),
    dateMod: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field must be a date.',
    }),
    name: Joi.string().min(3).max(50).required().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'any.required': 'The {{#label}} field is mandatory.',
      'string.min': 'The {{#label}} field must contain at least 3 characters.',
      'string.max': 'The {{#label}} field must contain no more than 50 characters.',
    }),
    description: Joi.string().min(10).max(50).required().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'any.required': 'The {{#label}} field is mandatory.',
      'string.min': 'The {{#label}} field must contain at least 10 characters.',
      'string.max': 'The {{#label}} field must contain no more than 50 characters.',
    }),
    price: Joi.number().min(0.01).max(9999.99).required().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'any.required': 'The {{#label}} field is mandatory.',
      'number.min': 'The {{#label}} field must be a number greater than 0.',
      'number.max': 'The {{#label}} field must be a number less than 10000.',
    }),
    stock: Joi.number().min(0).max(10000).required().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'any.required': 'The {{#label}} field is mandatory.',
      'number.min': 'The {{#label}} field must be a number greater than or equal to 0.',
      'number.max': 'The {{#label}} field must be a number less than 10000.',
    }),
    img: Joi.string().pattern(URL_PATTERN).required().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'any.required': 'The {{#label}} field is mandatory.',
      'string.pattern.base': 'Invalid URL.',
    }),
    types: Joi.array().optional().messages({
      'array.base': 'The {{#label}} field must be an array.',
    }),
    categories: Joi.array().optional().messages({
      'array.base': 'The {{#label}} field must be an array.',
    }),
    fullDescription: Joi.string().optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
    }),
    info: Joi.string().max(100).optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.max': 'The {{#label}} field must contain no more than 100 characters.',
    }),
    favorite: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} field must be a boolean.',
    }),
    dateVisible: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field date must be a date.',
    }),
    visible: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} field must be a boolean.',
    }),
  });

  // `abortEarly: false` to avoid stopping at the first error, allowing all errors to be reported
  const { error } = Schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: error.details.map((err) => err.message),
    });
  }

  // Validation successful: proceed to the next middleware or the controller
  next();
};

// Validation middleware for full or partial updates //////////////////////////
export const validateUpdProd = (req, res, next) => {
  const Schema = Joi.object({
    reference: Joi.string().pattern(REF_PATTERN).messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.pattern.base': 'Invalid {{#label}}.',
    }),
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field must be a date.',
    }),
    dateMod: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field must be a date.',
    }),
    name: Joi.string().min(3).max(50).messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.min': 'The {{#label}} field must contain at least 3 characters.',
      'string.max': 'The {{#label}} field must contain no more than 50 characters.',
    }),
    description: Joi.string().min(10).max(50).messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.min': 'The {{#label}} field must contain at least 10 characters.',
      'string.max': 'The {{#label}} field must contain no more than 50 characters.',
    }),
    price: Joi.number().min(0.01).max(9999.99).messages({
      'number.base': 'The {{#label}} field must be a number.',
      'number.min': 'The {{#label}} field must be a number greater than 0.',
      'number.max': 'The {{#label}} field must be a number less than 10000.',
    }),
    stock: Joi.number().min(0).max(10000).messages({
      'number.base': 'The {{#label}} field must be a number.',
      'number.min': 'The {{#label}} field must be a number greater than or equal to 0.',
      'number.max': 'The {{#label}} field must be a number less than 10000.',
    }),
    img: Joi.string().pattern(URL_PATTERN).messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.pattern.base': 'Invalid URL.',
    }),
    types: Joi.array().optional().messages({
      'array.base': 'The {{#label}} field must be an array.',
    }),
    categories: Joi.array().optional().messages({
      'array.base': 'The {{#label}} field must be an array.',
    }),
    fullDescription: Joi.string().optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
    }),
    info: Joi.string().max(100).optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.max': 'The {{#label}} field must contain no more than 100 characters.',
    }),
    favorite: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} field must be a boolean.',
    }),
    dateVisible: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field date must be a date.',
    }),
    visible: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} field must be a boolean.',
    }),
  });

  // `abortEarly: false` to avoid stopping at the first error, allowing all errors to be reported
  const { error } = Schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: error.details.map((err) => err.message),
    });
  }

  // Validation successful: proceed to the next middleware or the controller
  next();
};
