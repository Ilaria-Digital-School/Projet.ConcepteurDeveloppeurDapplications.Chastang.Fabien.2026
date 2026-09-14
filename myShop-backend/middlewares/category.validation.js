import Joi from 'joi';
import { validateSchema } from './validation.js';

// Check if a value follows the format of an URL
// const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const URL_PATTERN = /^((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6}))?([\/\w \.-]*)*\/?$/;

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddCategory = (req, res, next) => {
  const Schema = Joi.object({
    value: Joi.number().integer().min(1).required().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'number.integer': 'The {{#label}} attribut must be an integer',
      'number.min': 'The {{#label}} attribut must be an integer greater than 0',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    field: Joi.string().min(1).max(50).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    name: Joi.string().min(1).max(50).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
    description: Joi.string().min(0).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
    }),
    img: Joi.string().pattern(URL_PATTERN).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut, it must be an URL',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};

// Validation middleware for full or partial updates //////////////////////////
export const validateUpdCategory = (req, res, next) => {
  const Schema = Joi.object({
    value: Joi.number().integer().min(1).optional().messages({
      'number.base': 'The {{#label}} attribut must be an integer',
      'number.integer': 'The {{#label}} attribut must be an integer',
      'number.min': 'The {{#label}} attribut must be an integer greater than 0',
    }),
    field: Joi.string().min(1).max(50).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
    }),
    name: Joi.string().min(1).max(50).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
    }),
    description: Joi.string().min(0).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
    }),
    img: Joi.string().pattern(URL_PATTERN).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.pattern.base': 'Invalid {{#label}} attribut, it must be an URL',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};
