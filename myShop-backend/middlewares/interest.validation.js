import Joi from 'joi';
import { validateSchema } from './validation.js';

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddInterest = (req, res, next) => {
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
    type: Joi.string().min(1).max(50).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
      'any.required': 'The {{#label}} attribut is mandatory',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};

// Validation middleware for full or partial updates //////////////////////////
export const validateUpdInterest = (req, res, next) => {
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
    type: Joi.string().min(1).max(50).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 1 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 50 characters',
    }),
  });

  // Validate the Joi schema
  validateSchema(Schema, req, res, next);
};
