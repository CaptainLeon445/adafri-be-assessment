import { NextFunction, Request, Response } from 'express';
import logger from '../../utilities/logger';
import { AppError } from '../error_handlers/app-error';
import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';
import { CampaignStatus } from '../../models/enums';

export const createCampaignValidator = (req: Request, res: Response, next: NextFunction) => {
  const schema: Joi.ObjectSchema = Joi.object()
    .required()
    .keys({
      title: Joi.string().required().messages({
        'string.base': 'Campaign title must be a string',
        'any.required': 'Campaign title is required',
      }),
      status: Joi.string()
        .valid(...Object.values(CampaignStatus))
        .required(),
      budget: Joi.number().min(0.0).precision(2).required().messages({
        'number.base': 'Campaign budget must be a number.',
        'number.min': 'Campaign budget must be greater than or equal to 0.0.',
        'number.precision': 'Campaign budget must have at most 2 decimal places.',
        'any.required': 'Campaign budget is required.',
      }),
      startDate: Joi.date().optional().messages({
        'date.base': 'campaign start date must be a date',
        'any.required': 'campaign start date is required',
      }),
      endDate: Joi.date().optional().messages({
        'date.base': 'campaign end date must be a date',
        'any.required': 'campaign end date is required',
      }),
    });
  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(error.details[0].message.replace(/"+/g, ''));
    return next(new AppError(error.details[0].message.replace(/"+/g, ''), 400));
  }
  next();
};

export const idParamvalidator = (req: Request, res: Response, next: NextFunction) => {
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().token().required(),
    },
  });
  next();
};
