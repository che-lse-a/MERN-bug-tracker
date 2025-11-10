const request = require('supertest');
const app = require('../src/server');
const { validateBugPayload } = require('../src/routes/bugs');

// Unit test: validation helper
test('validateBugPayload should reject empty or invalid payloads', () => {
  expect(validateBugPayload(null).valid).toBe(false);
  expect(validateBugPayload({}).valid).toBe(false);
  expect(validateBugPayload({ title: 123 }).valid).toBe(false);
  expect(validateBugPayload({ title: 'A bug' }).valid).toBe(true);
});

// Integration tests using the in-memory store (server started without MONGO_URI)
describe('Bug routes (integration with in-memory store)', () => {
  let api;
  beforeAll(() => {
    api = request(app);
  });

  test('POST /api/bugs creates a bug', async () => {
    const res = await api.post('/api/bugs').send({ title: 'Test bug', description: 'details' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test bug');
  });

  test('GET /api/bugs returns list', async () => {
    const res = await api.get('/api/bugs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PATCH /api/bugs/:id updates a bug', async () => {
    const create = await api.post('/api/bugs').send({ title: 'Another' });
    const id = create.body.id;
    const res = await api.patch(`/api/bugs/${id}`).send({ status: 'in-progress' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('in-progress');
  });

  test('DELETE /api/bugs/:id deletes a bug', async () => {
    const create = await api.post('/api/bugs').send({ title: 'To delete' });
    const id = create.body.id;
    const res = await api.delete(`/api/bugs/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

});
