require('dotenv').config(); // Load environment variables at the very top

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const Project = require('../../models/Project');
const User = require('../../models/User');

let token, userId, projectId;

beforeAll(async () => {
  jest.setTimeout(10000);

  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI in environment variables');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment variables');
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({ email: 'testuser@example.com' });
  await Project.deleteMany({ url: 'https://heatmap.example.com' });

  const user = new User({
    email: 'testuser@example.com',
    password: 'test123',
    name: 'Test User',
  });
  await user.save();

  userId = user._id.toString();
  token = jwt.sign({ id: userId, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await User.deleteMany({ email: 'testuser@example.com' });
  await mongoose.connection.close();
});

describe('Projects API', () => {
  test('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Heatmap Analysis Tool',
        url: 'https://heatmap.example.com',
        domain: 'example.com',
        description: 'Test description',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.project).toHaveProperty('_id');
    expect(res.body).toHaveProperty('trackingCode');
    projectId = res.body.project._id;
  });

  test('should fail to create a project with duplicate URL', async () => {
    const res = await request(app)
      .post('/api/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Duplicate Project',
        url: 'https://heatmap.example.com',
        domain: 'example.com',
        description: 'Test description',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test('should fail to create a project with missing fields', async () => {
    const res = await request(app)
      .post('/api/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '',
        url: '',
        domain: '',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  test('should get all projects for the user', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.projects)).toBeTruthy();
  });

  test('should get project by ID', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.project).toHaveProperty('_id', projectId);
  });

  test('should return 404 for non-existent project ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/projects/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test('should update the project', async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Project',
        url: 'https://updated-url.com',
        domain: 'updated.com',
        description: 'Updated description',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.project.name).toBe('Updated Project');
    expect(res.body.project.url).toBe('https://updated-url.com');
  });

  test('should fail to update with invalid project ID', async () => {
    const res = await request(app)
      .put('/api/projects/invalid-id')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Invalid',
        url: 'invalid.com',
        domain: 'invalid',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  test('should delete the project', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test('should return 404 on deleting non-existent project', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/projects/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
