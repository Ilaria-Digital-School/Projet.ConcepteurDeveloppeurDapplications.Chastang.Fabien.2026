import Joi from 'joi';
import { validateSchema } from './validation.js';

// Validation middleware for insertion ////////////////////////////////////////
export const validateAddMessage = (req, res, next) => {
  const Schema = Joi.object({
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    dateRep: Joi.date().optional().messages({
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
    message: Joi.string().min(3).max(2000).required().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 3 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 2000 characters',
      'any.required': 'The {{#label}} attribut attribut is mandatory',
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
export const validateUpdMessage = (req, res, next) => {
  const Schema = Joi.object({
    dateIns: Joi.date().optional().messages({
      'date.base': 'The {{#label}} attribut must be a date',
    }),
    dateRep: Joi.date().optional().messages({
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
    message: Joi.string().min(3).max(2000).optional().messages({
      'string.base': 'The {{#label}} attribut must be a string',
      'string.min': 'The {{#label}} attribut must contain at least 3 characters',
      'string.max': 'The {{#label}} attribut must contain no more than 2000 characters',
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
