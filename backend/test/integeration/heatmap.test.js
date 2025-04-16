const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const UserData = require('../../models/UserData');
const Project = require('../../models/Project');
const jwt = require('jsonwebtoken');

describe('GET /api/track/heatmap/:projectId', () => {
  let token, projectId;

  beforeAll(async () => {
    // Mock user ID
    const mockUserId = new mongoose.Types.ObjectId();

    // Create a test project with all required fields
    const project = await Project.create({
      name: 'Test Project',
      domain: 'testdomain.com',
      url: 'https://testdomain.com',
      owner: mockUserId, // Include required 'owner'
    });

    projectId = project._id.toString();

    // Generate a valid JWT for that user
    token = jwt.sign({ id: mockUserId }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    // Insert test user interaction data
    await UserData.create({
      projectId,
      sessionId: 'sess-123',
      x: 200,
      y: 300,
      eventType: 'click',
      timestamp: new Date().toISOString(),
      os: 'Windows',
      device: 'Desktop',
      browser: 'Chrome',
      rageClicks: 1,
      deadClicks: 0,
      quickClicks: 0,
      intensity: 2,
    });
  });

  afterAll(async () => {
    // await UserData.deleteMany({});
    // await Project.deleteMany({});
    await mongoose.connection.close();
  });

  it('should return heatmap data for a valid projectId', async () => {
    const res = await request(app)
      .get(`/api/track/heatmap/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('x');
    expect(res.body.data[0]).toHaveProperty('y');
    expect(res.body.data[0]).toHaveProperty('intensity');
  });
});
