const request = require('supertest');
const app = require('../../app'); // 👈 use app.js not server.js
const mongoose = require('mongoose');
const Project = require('../../models/Project');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

let token, userId, projectId;

beforeAll(async () => {
  jest.setTimeout(10000); // Set timeout for the tests
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Check if user exists
  let user = await User.findOne({ email: 'testuser@example.com' });
  if (!user) {
    user = new User({ email: 'testuser@example.com', password: 'test123' });
    await user.save();
  }

  userId = user._id.toString();
  token = jwt.sign({ id: userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  // await Project.deleteMany({}); // Only delete projects
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
      },1000);

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
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Project with this URL already exists.');
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
    expect(res.body.message).toBe('All fields are required.');
  });

  test('should get all projects for the user', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.projects.length).toBeGreaterThan(0);
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
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.project.name).toBe('Updated Project');
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
    expect(res.body.message).toBe('Invalid project ID format');
  });

  test('should delete the project', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Project deleted successfully.');
  });

  test('should return 404 on deleting non-existent project', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`) // already deleted
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Project not found');
  });
});
