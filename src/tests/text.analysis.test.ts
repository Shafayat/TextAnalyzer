import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

describe('All TextAnalyzer Tests', () => {
  let mongoServer: MongoMemoryServer;

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

  describe('Text Analysis Endpoints', () => {
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

  describe('Text List and Fetch Endpoints', () => {
    let agent1: any, agent2: any, createdTextId: string;
    beforeEach(async () => {
      // Clear all collections
      for (const collection of Object.values(mongoose.connection.collections)) {
        await collection.deleteMany({});
      }
      agent1 = request.agent(app);
      agent2 = request.agent(app);
      await agent1.post('/signup').send({ username: 'user1', password: 'pass1' });
      const signinRes1 = await agent1.post('/signin').send({ username: 'user1', password: 'pass1' });
      if (signinRes1.status !== 200) {
        console.error('agent1 signin error:', signinRes1.status, signinRes1.body);
      }
      expect(signinRes1.status).toBe(200);
      await agent2.post('/signup').send({ username: 'user2', password: 'pass2' });
      const signinRes2 = await agent2.post('/signin').send({ username: 'user2', password: 'pass2' });
      if (signinRes2.status !== 200) {
        console.error('agent2 signin error:', signinRes2.status, signinRes2.body);
      }
      expect(signinRes2.status).toBe(200);
      for (let i = 0; i < 2; i++) {
        const res = await agent1.post('/api/texts').send({ content: `Message ${i + 1}` });
        if (i === 0) createdTextId = res.body._id;
      }
    });

    it('should require authentication for GET /api/texts', async () => {
      await request(app).get('/api/texts').expect(401);
    });

    it('should list paginated texts for the user', async () => {
      const res = await agent1
        .get('/api/texts?page=1&limit=1')
        .expect(200);
      expect(res.body).toHaveProperty('texts');
      expect(res.body.texts.length).toBe(1);
      expect(res.body).toHaveProperty('total', 2);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageCount', 2);
    });

    it('should return empty list for user with no texts', async () => {
      const res = await agent2
        .get('/api/texts')
        .expect(200);
      expect(res.body.texts.length).toBe(0);
    });

    it('should require authentication for GET /api/texts/:id', async () => {
      await request(app).get(`/api/texts/${createdTextId}`).expect(401);
    });

    it('should fetch a single text by id for the owner', async () => {
      const res = await agent1
        .get(`/api/texts/${createdTextId}`)
        .expect(200);
      expect(res.body).toHaveProperty('_id', createdTextId);
      expect(res.body).toHaveProperty('content', 'Message 1');
    });

    it('should return 404 for non-existent text', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await agent1
        .get(`/api/texts/${fakeId}`)
        .expect(404);
    });

    it('should not allow access to another user\'s text', async () => {
      await agent2
        .get(`/api/texts/${createdTextId}`)
        .expect(404);
    });
  });
}); 