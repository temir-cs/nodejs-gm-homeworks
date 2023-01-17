import type { RequestHandler } from 'express';
import Joi from 'joi';

const schema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().min(4).max(130).required(),
});

const userValidator = () => {
  const handler: RequestHandler = (req, res, next): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json(error.message);
    }
    next();
  };
  return handler;
};

export default userValidator;