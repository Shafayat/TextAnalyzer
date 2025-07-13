import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import Text from '../models/Text';
import { analyzeText } from '../services/textAnalysis.service';

let mongoServer: MongoMemoryServer;
let testUser: any;
let authCookie: string;

describe('Text Analysis', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect();
    await mongoose.connect(uri);
    
    // Create a test user and get auth cookie
    await request(app)
      .post('/signup')
      .send({ username: 'testuser', password: 'testpass' });
    
    const loginRes = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'testpass' });
    
    authCookie = loginRes.headers['set-cookie']?.[0] || '';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Text.deleteMany({});
  });

  describe('Text Analysis Service', () => {
    it('should count words correctly', () => {
      const text = "The quick brown fox jumps over the lazy dog.";
      const analysis = analyzeText(text);
      expect(analysis.wordCount).toBe(9);
    });

    it('should count characters correctly', () => {
      const text = "Hello world!";
      const analysis = analyzeText(text);
      expect(analysis.characterCount).toBe(12);
    });

    it('should count sentences correctly', () => {
      const text = "The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.";
      const analysis = analyzeText(text);
      expect(analysis.sentenceCount).toBe(2);
    });

    it('should count paragraphs correctly', () => {
      const text = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
      const analysis = analyzeText(text);
      expect(analysis.paragraphCount).toBe(3);
    });

    it('should find longest words correctly', () => {
      const text = "The quick brown fox jumps over the lazy dog.";
      const analysis = analyzeText(text);
      expect(analysis.longestWords).toContain('quick');
      expect(analysis.longestWords).toContain('brown');
      expect(analysis.longestWords).toContain('jumps');
    });

    it('should find longest words per paragraph correctly', () => {
      const text = "First paragraph with long words like extraordinary.\n\nSecond paragraph with different words like magnificent.";
      const analysis = analyzeText(text);
      expect(analysis.longestWordsPerParagraph).toHaveLength(2);
      expect(analysis.longestWordsPerParagraph[0].paragraphIndex).toBe(1);
      expect(analysis.longestWordsPerParagraph[0].longestWords).toContain('extraordinary');
      expect(analysis.longestWordsPerParagraph[1].paragraphIndex).toBe(2);
      expect(analysis.longestWordsPerParagraph[1].longestWords).toContain('magnificent');
    });
  });

  describe('POST /texts', () => {
    it('should create a new text with analysis', async () => {
      const textContent = "The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.";
      const res = await request(app)
        .post('/texts')
        .set('Cookie', authCookie)
        .send({ content: textContent });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('content', textContent);
      expect(res.body).toHaveProperty('analysis');
      expect(res.body.analysis).toHaveProperty('wordCount', 16);
      expect(res.body.analysis).toHaveProperty('characterCount', 75);
      expect(res.body.analysis).toHaveProperty('sentenceCount', 2);
      expect(res.body.analysis).toHaveProperty('paragraphCount', 1);
      expect(res.body.analysis).toHaveProperty('longestWords');
      expect(res.body.analysis).toHaveProperty('longestWordsPerParagraph');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/texts')
        .send({ content: "Test text" });
      
      expect(res.status).toBe(401);
    });
  });
}); 