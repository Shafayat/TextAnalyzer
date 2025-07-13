import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import passport from '../services/passport.service';
import User from '../models/User';

let mongoServer: MongoMemoryServer;

describe('Passport Service', () => {
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

  describe('Session Serialization', () => {
    it('should serialize user correctly', (done) => {
      User.create({ username: 'testuser', password: '$2a$10$test' })
        .then((user) => {
          passport.serializeUser(user, (err, id) => {
            expect(err).toBeNull();
            expect(id).toBe((user as any)._id.toString());
            done();
          });
        });
    });

    it('should deserialize user correctly', (done) => {
      User.create({ username: 'testuser', password: '$2a$10$test' })
        .then((user) => {
          passport.deserializeUser((user as any)._id.toString(), (err, deserializedUser) => {
            expect(err).toBeNull();
            expect(deserializedUser).toBeTruthy();
            if (deserializedUser && typeof deserializedUser === 'object' && 'username' in deserializedUser) {
              expect((deserializedUser as any).username).toBe('testuser');
            }
            done();
          });
        });
    });
  });
}); 