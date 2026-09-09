import Joi from 'joi';

// Check if a value follows the format of a user reference
const REF_PATTERN = /^[A-Z0-9]{10}$/;

// Check if a value follows the format of a password
const SPECIAL_CHR = '&~#"\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:/!§-';
const PSWD_PATTERN = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' + SPECIAL_CHR + '])[a-zA-Z\\d' + SPECIAL_CHR + ']{10,}$',
);

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddUser = (req, res, next) => {
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
    email: Joi.string().email().required().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'any.required': 'The {{#label}} field field is mandatory.',
      'string.email': 'Invalid email.',
    }),
    pswd: Joi.string().pattern(PSWD_PATTERN).required().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'any.required': 'The {{#label}} field field is mandatory.',
      'string.pattern.base': 'Invalid password.',
    }),
    gender: Joi.enum().values(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'any.only': '{{#label}} field must be one of the following values: {{#values}}.',
    }),
    interests: Joi.array().optional().messages({
      'array.base': 'The {{#label}} field must be an array.',
    }),
    country: Joi.number().min(0).optional().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'number.min': 'The {{#label}} field must be a number greater than or equal to 0.',
    }),
    role: Joi.enum().values(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'any.only': '{{#label}} field must be one of the following values: {{#values}}.',
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
export const validateUpdUser = (req, res, next) => {
  const Schema = Joi.object({
    reference: Joi.string().pattern(REF_PATTERN).optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.pattern.base': 'Invalid {{#label}}.',
    }),
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field must be a date.',
    }),
    dateMod: Joi.date().optional().messages({
      'date.base': 'The {{#label}} field must be a date.',
    }),
    name: Joi.string().min(3).max(50).optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.min': 'The {{#label}} field must contain at least 3 characters.',
      'string.max': 'The {{#label}} field must contain no more than 50 characters.',
    }),
    email: Joi.string().email().optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.email': 'Invalid email.',
    }),
    pswd: Joi.string().pattern(PSWD_PATTERN).optional().messages({
      'string.base': 'The {{#label}} field must be a string.',
      'string.pattern.base': 'Invalid password.',
    }),
    gender: Joi.enum().values(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'any.only': '{{#label}} field must be one of the following values: {{#values}}.',
    }),
    interests: Joi.array().optional().messages({
      'array.base': 'The {{#label}} field must be an array.',
    }),
    country: Joi.number().min(0).optional().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'number.min': 'The {{#label}} field must be a number greater than or equal to 0.',
    }),
    role: Joi.enum().values(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} field must be a number.',
      'any.only': '{{#label}} field must be one of the following values: {{#values}}.',
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
