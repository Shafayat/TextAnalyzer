import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongoServer: MongoMemoryServer;

describe('Text Analysis Endpoints', () => {
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

  let authCookie: string;

  beforeEach(async () => {
    // Create and login a user for each test
    await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: 'testpass' });
    
    const loginRes = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'testpass' });
    
    authCookie = loginRes.headers['set-cookie']?.[0] || '';
  });

  describe('POST /api/texts', () => {
    it('should create text with full analysis', async () => {
      const testText = 'Hello world. This is a test.\n\nSecond paragraph here.';
      
      const res = await request(app)
        .post('/api/texts')
        .set('Cookie', authCookie)
        .send({ content: testText })
        .expect(201);
      
      expect(res.body).toHaveProperty('_id');
      expect(res.body.content).toBe(testText);
      expect(res.body.analysis).toHaveProperty('wordCount', 9);
      expect(res.body.analysis).toHaveProperty('characterCount', 52);
      expect(res.body.analysis).toHaveProperty('sentenceCount', 3);
      expect(res.body.analysis).toHaveProperty('paragraphCount', 2);
      expect(res.body.analysis).toHaveProperty('longestWordsPerParagraph');
    });
  });

  describe('POST /api/analyze/word-count', () => {
    it('should return word count analysis', async () => {
      const testText = 'Hello world. This is a test.';
      
      const res = await request(app)
        .post('/api/analyze/word-count')
        .set('Cookie', authCookie)
        .send({ content: testText })
        .expect(200);
      
      expect(res.body).toHaveProperty('wordCount', 6);
      expect(res.body.analysis).toHaveProperty('wordCount', 6);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/analyze/word-count')
        .send({ content: 'test' })
        .expect(401);
      
      expect(res.body).toHaveProperty('message', 'Authentication required');
    });
  });

  describe('POST /api/analyze/character-count', () => {
    it('should return character count analysis', async () => {
      const testText = 'Hello world!';
      
      const res = await request(app)
        .post('/api/analyze/character-count')
        .set('Cookie', authCookie)
        .send({ content: testText })
        .expect(200);
      
      expect(res.body).toHaveProperty('characterCount', 12);
      expect(res.body.analysis).toHaveProperty('characterCount', 12);
    });
  });

  describe('POST /api/analyze/sentence-count', () => {
    it('should return sentence count analysis', async () => {
      const testText = 'Hello world. This is a test. Another sentence!';
      
      const res = await request(app)
        .post('/api/analyze/sentence-count')
        .set('Cookie', authCookie)
        .send({ content: testText })
        .expect(200);
      
      expect(res.body).toHaveProperty('sentenceCount', 3);
      expect(res.body.analysis).toHaveProperty('sentenceCount', 3);
    });
  });

  describe('POST /api/analyze/paragraph-count', () => {
    it('should return paragraph count analysis', async () => {
      const testText = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
      
      const res = await request(app)
        .post('/api/analyze/paragraph-count')
        .set('Cookie', authCookie)
        .send({ content: testText })
        .expect(200);
      
      expect(res.body).toHaveProperty('paragraphCount', 3);
      expect(res.body.analysis).toHaveProperty('paragraphCount', 3);
    });

    it('should return 1 for single paragraph', async () => {
      const testText = 'Single paragraph text.';
      
      const res = await request(app)
        .post('/api/analyze/paragraph-count')
        .set('Cookie', authCookie)
        .send({ content: testText })
        .expect(200);
      
      expect(res.body).toHaveProperty('paragraphCount', 1);
    });
  });

  describe('POST /api/analyze/longest-words-by-paragraph', () => {
    it('should return longest words by paragraph', async () => {
      const testText = 'Short text.\n\nLonger paragraph with multiple words.';
      
      const res = await request(app)
        .post('/api/analyze/longest-words-by-paragraph')
        .set('Cookie', authCookie)
        .send({ content: testText })
        .expect(200);
      
      expect(res.body).toHaveProperty('longestWordsByParagraph');
      expect(res.body.longestWordsByParagraph).toHaveLength(2);
      expect(res.body.longestWordsByParagraph[0]).toHaveProperty('paragraphIndex', 1);
      expect(res.body.longestWordsByParagraph[1]).toHaveProperty('paragraphIndex', 2);
    });
  });

  describe('Input validation', () => {
    it('should reject empty content', async () => {
      const res = await request(app)
        .post('/api/analyze/word-count')
        .set('Cookie', authCookie)
        .send({ content: '' })
        .expect(400);
      
      expect(res.body).toHaveProperty('message', 'Content is required and must be a string');
    });

    it('should reject non-string content', async () => {
      const res = await request(app)
        .post('/api/analyze/word-count')
        .set('Cookie', authCookie)
        .send({ content: 123 })
        .expect(400);
      
      expect(res.body).toHaveProperty('message', 'Content is required and must be a string');
    });

    it('should reject missing content', async () => {
      const res = await request(app)
        .post('/api/analyze/word-count')
        .set('Cookie', authCookie)
        .send({})
        .expect(400);
      
      expect(res.body).toHaveProperty('message', 'Content is required and must be a string');
    });
  });
}); 