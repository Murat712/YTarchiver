import { loadEnv } from 'vite';
import mongoose from 'mongoose';
import { beforeAll, aroundEach, afterAll, afterEach } from 'vitest';

const env = loadEnv('test', process.cwd(), '');
Object.assign(process.env, env);

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
