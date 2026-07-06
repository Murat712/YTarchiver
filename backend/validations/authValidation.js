import Joi from 'joi';

const usernameField = Joi.string().alphanum().min(5).max(30);
const passwordField = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,100}$'));

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
