import Joi from 'joi';
import { validateSchema } from './validation.js';

// Check if a value follows the format of a user reference
const REF_PATTERN = /^[A-Z0-9]{6}-[A-Z0-9]{6}$/;

// Check if a value follows the format of an URL
// const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const URL_PATTERN = /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6}))?([\/\w \.-]*)*\/?$/;

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddProduct = (req, res, next) => {
  const Schema = Joi.object({
    reference: Joi.string().pattern(REF_PATTERN).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}}',
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
    description: Joi.string().min(10).max(50).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 10 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    price: Joi.number().min(0.01).max(9999.99).required().messages({
      'number.base': 'The {{#label}} attribut must be a number',
      'number.min': 'The {{#label}} attribut must be a number greater than or equal to 0.01',
      'number.max': 'The {{#label}} attribut must be a number less than or equal to 9999.99',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    stock: Joi.number().integer().min(0).max(10000).required().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'number.integer': 'The {{#label}} attribut must be an integer',
      'number.min': 'The {{#label}} attribut must be an integer greater than or equal to 0',
      'number.max': 'The {{#label}} attribut must be an integer less than or equal to 10000',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    img: Joi.string().pattern(URL_PATTERN).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut, it must be an URL',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    types: Joi.array().items(
      Joi.number().integer().min(1).optional().messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than 0',
      })).optional().messages({
      'array.base': 'The {{#label}} attribut must be an array',
    }),
    categories: Joi.array().items(
      Joi.number().integer().min(1).optional().messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than 0',
      })).optional().messages({
      'array.base': 'The {{#label}} attribut must be an array',
    }),
    fullDescription: Joi.string().min(0).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
    }),
    info: Joi.string().min(0).max(100).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.max': 'The {{#label}} attribut must contain no more than 100 characters',
    }),
    favorite: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} attribut must be a boolean',
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
export const validateUpdProduct = (req, res, next) => {
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
    description: Joi.string().min(10).max(50).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 10 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
    }),
    price: Joi.number().min(0.01).max(9999.99).optional().messages({
      'number.base': 'The {{#label}} attribut must be a number',
      'number.min': 'The {{#label}} attribut must be a number greater than or equal to 0.01',
      'number.max': 'The {{#label}} attribut must be a number less than or equal to 9999.99',
    }),
    stock: Joi.number().integer().min(0).max(10000).optional().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'number.integer': 'The {{#label}} attribut must be an integer',
      'number.min': 'The {{#label}} attribut must be an integer greater than or equal to 0',
      'number.max': 'The {{#label}} attribut must be an integer less than or equal to 10000',
    }),
    img: Joi.string().pattern(URL_PATTERN).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut, it must be an URL',
    }),
    types: Joi.array().items(
      Joi.number().integer().min(1).optional().messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than 0',
      })).optional().messages({
      'array.base': 'The {{#label}} attribut must be an array',
    }),
    categories: Joi.array().items(
      Joi.number().integer().min(1).optional().messages({
        'number.base': 'The {{#label}} attribut must be an integer',
        'number.integer': 'The {{#label}} attribut must be an integer',
        'number.min': 'The {{#label}} attribut must be an integer greater than 0',
      })).optional().messages({
      'array.base': 'The {{#label}} attribut must be an array',
    }),
    fullDescription: Joi.string().min(0).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
    }),
    info: Joi.string().min(0).max(100).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.max': 'The {{#label}} attribut must contain no more than 100 characters',
    }),
    favorite: Joi.boolean().optional().messages({
      'boolean.base': 'The {{#label}} attribut must be a boolean',
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
