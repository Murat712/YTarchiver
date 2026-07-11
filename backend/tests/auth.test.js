import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { register, login } from './helpers.js';

describe('POST /api/auth/register', () => {
  it('should return 201 when user is created successfully', async () => {
    const res = await register('testuser', 'PassWD@123');
    expect(res.status).toBe(201);
  });
});

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await register('testuser', 'PassWD@123');
  });

  it('should return 403 when a user already exists', async () => {
    const res = await register('testuser', 'PassWD@123');
    expect(res.status).toBe(403);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await register('testuser', 'PassWD@123');
  });

  it('should return 200 with valid credentials', async () => {
    const res = await login('testuser', 'PassWD@123');
    expect(res.status).toBe(200);
  });
});

describe('PATCH /api/auth/update', () => {
  let token;

  beforeEach(async () => {
    await register('testuser', 'PassWD@123');
    const res = await login('testuser', 'PassWD@123');
    token = res.body.token;
  });

  it('should return 200 with updated user data', async () => {
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
