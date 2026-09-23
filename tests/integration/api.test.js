const request = require('supertest');
const app = require('../../src/app');
const taskService = require('../../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('GET /health', () => {
  test('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Task API', () => {
  test('POST /api/tasks creates a task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Learn Jenkins' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Learn Jenkins');
  });

  test('POST /api/tasks rejects an invalid payload', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/tasks lists tasks', async () => {
    await request(app).post('/api/tasks').send({ title: 'a' });
    await request(app).post('/api/tasks').send({ title: 'b' });
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('GET /api/tasks/:id returns a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'a' });
    const res = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  test('GET /api/tasks/:id returns 404 for a missing task', async () => {
    const res = await request(app).get('/api/tasks/does-not-exist');
    expect(res.status).toBe(404);
  });

  test('PUT /api/tasks/:id updates a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'a' });
    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  test('DELETE /api/tasks/:id deletes a task', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'a' });
    const res = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(204);

    const getRes = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(getRes.status).toBe(404);
  });
});
