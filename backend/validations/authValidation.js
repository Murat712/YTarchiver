import Joi from 'joi';

const usernameField = Joi.string().pattern(/^[a-zA-Z0-9_]{5,30}$/);
const passwordField = Joi.string().pattern(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/,
);

export const loginSchema = Joi.object({
  username: usernameField.required(),
  password: passwordField.required(),
});

export const registerSchema = Joi.object({
  username: usernameField.required(),
  password: passwordField.required(),
});

export const updateSchema = Joi.object({
  newPassword: passwordField,
  newUsername: usernameField,

  username: Joi.when('newUsername', {
    is: Joi.exist(),
    then: usernameField.required(),
  }),
  password: Joi.when('newPassword', {
    is: Joi.exist(),
    then: passwordField.required(),
  }),
}).or('newPassword', 'newUsername');
