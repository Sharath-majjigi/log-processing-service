// tests/api.test.js
import request from 'supertest';
import app from '../src/api/index.js';

test('POST /upload should return jobId', async () => {
  const res = await request(app).post('/upload').attach('file', 'tests/test.log');
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('jobId');
});
