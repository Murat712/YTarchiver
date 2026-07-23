import AppError from '../utils/AppError.js';

const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const { error } = schema.validate(req[source]);
    if (error)
      return next(new AppError(error.message, 400, 'Validating Fields'));
    next();
  };

export default validate;
