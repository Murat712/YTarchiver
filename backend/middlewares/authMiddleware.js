import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import { JWT_SECRET_KEY } from '../config/env.js';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new AppError('Authorization header is missing!', 401, 'User Auth'),
    );
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(new AppError('Invalid auth header format', 401, 'User Auth'));
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return next(
      new AppError('Session Expired or Invalid Token', 401, 'User Auth'),
    );
  }
};

export { authenticateUser };
