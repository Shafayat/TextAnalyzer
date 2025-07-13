import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';

let mongoServer: MongoMemoryServer;

describe('User Authentication', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /signup', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'testpass' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).not.toHaveProperty('password');
    });
  });

  describe('POST /signin', () => {
    it('should login an existing user', async () => {
      // First, signup
      await request(app)
        .post('/signup')
        .send({ username: 'testuser2', password: 'testpass2' });
      // Then, signin
      const res = await request(app)
        .post('/signin')
        .send({ username: 'testuser2', password: 'testpass2' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('username', 'testuser2');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should not login with wrong password', async () => {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser2', password: 'testpass2' });
      const res = await request(app)
        .post('/signin')
        .send({ username: 'testuser2', password: 'wrongpass' });
      expect(res.status).toBe(401);
    });
  });
}); 