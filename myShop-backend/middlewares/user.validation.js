import Joi from 'joi';
import { validateSchema } from './validation.js';

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
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    dateMod: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    name: Joi.string().min(3).max(50).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 3 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    email: Joi.string().email().required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.email': 'Invalid {{#label}} attribut, it must be an email address',
      'any.required': 'The {{#label}} attribut attribut is mandatory',
    }),
    pswd: Joi.string().pattern(PSWD_PATTERN).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut, it must be a valid password',
      'any.required': 'The {{#label}} attribut attribut is mandatory',
    }),
    gender: Joi.number().valid(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
    }),
    interests: Joi.array().items(
      Joi.number().integer().min(1).messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than 0',
      })).optional().messages({
      'array.base': 'The {{#label}} attribut must be an array',
    }),
    country: Joi.number().integer().min(0).optional().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'number.integer': 'The {{#label}} attribut must be an integer',
      'number.min': 'The {{#label}} attribut must be an integer greater than or equal to 0',
    }),
    role: Joi.number().valid(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
    }),
    dateVisible: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut date must be a date',
    }),
    visible: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} attribut must be a boolean',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};

// Validation middleware for full or partial updates //////////////////////////
export const validateUpdUser = (req, res, next) => {
  const Schema = Joi.object({
    reference: Joi.string().pattern(REF_PATTERN).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut',
    }),
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    dateMod: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    name: Joi.string().min(3).max(50).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 3 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
    }),
    email: Joi.string().email().optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.email': 'Invalid {{#label}} attribut, it must be an email address',
    }),
    pswd: Joi.string().pattern(PSWD_PATTERN).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut, it must be a valid password',
    }),
    gender: Joi.number().valid(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
    }),
    interests: Joi.array().items(
      Joi.number().integer().min(1).messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than 0',
      })).optional().messages({
      'array.base': 'The {{#label}} attribut must be an array',
    }),
    country: Joi.number().integer().min(0).optional().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'number.integer': 'The {{#label}} attribut must be an integer',
      'number.min': 'The {{#label}} attribut must be an integer greater than or equal to 0',
    }),
    role: Joi.number().valid(0, 1, 2).optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
      'any.only': 'The {{#label}} attribut must be one of the following values: {{#values}}',
    }),
    dateVisible: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut date must be a date',
    }),
    visible: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} attribut must be a boolean',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};
