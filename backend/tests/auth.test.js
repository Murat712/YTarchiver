import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('POST /api/auth/register', () => {
  it('201 return with valid information', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'PassWD@123',
    });

    expect(res.status).toBe(201);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'PassWD@123',
    });
  });

  it('200 return with valid information', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'PassWD@123',
    });

    expect(res.status).toBe(200);
  });
});

describe('PATCH /api/auth/update', () => {
  let token;

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'PassWD@123',
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'PassWD@123' });
    token = res.body.token;
  });

  it('200 return with valid information', async () => {
    const res = await request(app)
      .patch('/api/auth/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'testuser',
        newUsername: 'testuserupdated',
        password: 'PassWD@123',
        newPassword: 'PassWD@123updated',
      });

    expect(res.status).toBe(200);
  });
});
