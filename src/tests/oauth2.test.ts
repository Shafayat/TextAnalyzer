import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongoServer: MongoMemoryServer;

describe('OAuth2 Authentication', () => {
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

  describe('GET /auth/google', () => {
    it('should redirect to OAuth authorization', async () => {
      const res = await request(app)
        .get('/auth/google')
        .expect(302);
      
      expect(res.headers.location).toContain('localhost:8080/authorize');
    });
  });

  describe('GET /api/me', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/me')
        .expect(401);
      
      expect(res.body).toHaveProperty('message', 'Not authenticated');
    });

    it('should return user info when authenticated', async () => {
      // First create and login a user
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'testpass' });
      
      const loginRes = await request(app)
        .post('/signin')
        .send({ username: 'testuser', password: 'testpass' });
      
      const cookie = loginRes.headers['set-cookie']?.[0];
      
      const res = await request(app)
        .get('/api/me')
        .set('Cookie', cookie)
        .expect(200);
      
      expect(res.body).toHaveProperty('username', 'testuser');
    });
  });

  describe('POST /logout', () => {
    it('should logout user successfully', async () => {
      // First create and login a user
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'testpass' });
      
      const loginRes = await request(app)
        .post('/signin')
        .send({ username: 'testuser', password: 'testpass' });
      
      const cookie = loginRes.headers['set-cookie']?.[0];
      
      const res = await request(app)
        .post('/logout')
        .set('Cookie', cookie)
        .expect(200);
      
      expect(res.body).toHaveProperty('message', 'Logged out');
    });
  });
}); 