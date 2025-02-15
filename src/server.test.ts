import request from 'supertest';
import app from './server';

// Mock SQLite database
jest.mock('sqlite3', () => ({
  Database: jest.fn(() => ({
    run: jest.fn((query, params, callback) => {
      if (callback) callback(null);
    }),
    get: jest.fn((query, params, callback) => {
      if (params[0] === 'test@example.com') {
        callback(null, {
          email: 'test@example.com',
          categories: JSON.stringify([1, 2, 3])
        });
      } else {
        callback(null, null);
      }
    }),
    all: jest.fn((query, callback) => {
      callback(null, [{
        email: 'test@example.com',
        categories: JSON.stringify([1, 2, 3])
      }]);
    })
  }))
}));

describe('User API', () => {
  describe('POST /users', () => {
    it('should reject invalid email format', async () => {
      const invalidUser = {
        email: 'not-an-email',
        categories: [1, 2, 3]
      };

      const response = await request(app)
        .post('/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid email format' });
    });

    it('should reject invalid categories format', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'valid@email.com',
          categories: 'not-an-array'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid input data' });
    });

    it('should create user with valid data', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'test@example.com',
          categories: [1, 2, 3]
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User created successfully' });
    });
  });

  describe('GET /users/:email', () => {
    it('should get existing user', async () => {
      const response = await request(app)
        .get('/users/test@example.com');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        email: 'test@example.com',
        categories: [1, 2, 3]
      });
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/nonexistent@example.com');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });
});