import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env.js';
import { JWT_EXPIRE_TIME } from '../config/env.js';
import AppError from '../utils/AppError.js';

const register = async (req, res, next) => {
  try {
    if (await User.exists({}))
      return next(
        new AppError(
          'There is already a registered user',
          403,
          'User Register',
        ),
      );

    const { username, password } = req.body;

    await User.create({ username, password });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    error.operation = 'User Register';
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(
        new AppError('Wrong username or password', 401, 'User Login'),
      );
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    });

    user.password = undefined;

    return res.status(200).json({ message: 'Login Successfully', token, user });
  } catch (error) {
    error.operation = 'User Login';
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { password, newUsername, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId).select('+password');
    if (!user)
      return next(new AppError('User Not Found', 404, 'Updating User'));

    if (newPassword) {
      const isPasswordValid = await user.comparePassword(
        password,
        user.password,
      );
      if (!isPasswordValid)
        return next(new AppError('Invalid Password', 401, 'Updating User'));
      else user.password = newPassword;
    }

    if (newUsername) {
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser)
        return next(
          new AppError('Username Already Taken', 400, 'Updating User'),
        );
      user.username = newUsername;
    }

    const updatedUser = await user.save();

    return res.status(200).json(updatedUser);
  } catch (error) {
    error.operation = 'Update User';
    next(error);
  }
};

export { register, login, updateUser };
