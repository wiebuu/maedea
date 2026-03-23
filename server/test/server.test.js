import request from 'supertest';
import app from '../src/server.js';

describe('Server Health Check', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Server is running');
  });

  test('GET /api/auth/me without token should return 401', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('token');
  });

  test('POST /api/auth/register with invalid data should return 400', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'invalid-email',
        password: '123'
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
  });
});

describe('API Routes', () => {
  test('GET /api/ideas without auth should return 401', async () => {
    const response = await request(app)
      .get('/api/ideas')
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  test('GET /api/users without auth should return 401', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});