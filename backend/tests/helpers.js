import request from 'supertest';
import { app } from '../app.js';

export const register = async (username, password) => {
  return await request(app).post('/api/auth/register').send({
    username: username,
    password: password,
  });
};

export const login = async (username, password) => {
  return await request(app).post('/api/auth/login').send({
    username: username,
    password: password,
  });
};
