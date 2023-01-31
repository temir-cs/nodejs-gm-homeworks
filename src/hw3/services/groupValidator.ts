import type { RequestHandler } from 'express';
import Joi from 'joi';
import { Permission } from '../interfaces/IGroup';

const schema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().unique().min(1).max(5).items(
    Joi.string().valid(Permission.READ),
    Joi.string().valid(Permission.WRITE),
    Joi.string().valid(Permission.DELETE),
    Joi.string().valid(Permission.SHARE),
    Joi.string().valid(Permission.UPLOAD_FILES),
  )
});

const groupValidator = () => {
  const handler: RequestHandler = (req, res, next): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json(error.message);
    }
    next();
  };
  return handler;
};

export default groupValidator;