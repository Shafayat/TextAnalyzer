import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongoServer: MongoMemoryServer;

describe('App Middleware', () => {
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

  describe('Dashboard Route Protection', () => {
    it('should redirect unauthenticated users from dashboard to login', async () => {
      const res = await request(app)
        .get('/dashboard')
        .expect(302);
      
      expect(res.headers.location).toBe('/');
    });

    it('should serve dashboard to authenticated users', async () => {
      // First create and login a user
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'testpass' });
      
      const loginRes = await request(app)
        .post('/signin')
        .send({ username: 'testuser', password: 'testpass' });
      
      const cookie = loginRes.headers['set-cookie']?.[0];
      
      const res = await request(app)
        .get('/dashboard')
        .set('Cookie', cookie)
        .expect(200);
      
      expect(res.text).toContain('TextAnalyzer - Dashboard');
    });
  });

  describe('Static File Serving', () => {
    it('should serve index.html at root', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      
      expect(res.text).toContain('TextAnalyzer - Login/Signup');
    });

    it('should serve dashboard.html at /dashboard for authenticated users', async () => {
      // First create and login a user
      await request(app)
        .post('/signup')
        .send({ username: 'testuser', password: 'testpass' });
      
      const loginRes = await request(app)
        .post('/signin')
        .send({ username: 'testuser', password: 'testpass' });
      
      const cookie = loginRes.headers['set-cookie']?.[0];
      
      const res = await request(app)
        .get('/dashboard')
        .set('Cookie', cookie)
        .expect(200);
      
      expect(res.text).toContain('TextAnalyzer - Dashboard');
      expect(res.text).toContain('Enter your text here');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes gracefully', async () => {
      const res = await request(app)
        .get('/nonexistent-route')
        .expect(404);
    });

    it('should handle malformed JSON in requests', async () => {
      const res = await request(app)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });
  });
}); 