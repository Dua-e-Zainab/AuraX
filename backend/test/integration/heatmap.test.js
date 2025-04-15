const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const UserData = require('../../models/UserData'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');

describe('GET /api/track/heatmap/:projectId', () => {
  let token, projectId;

  beforeAll(async () => {
    // Connect to DB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    // Generate a mock JWT token
    token = jwt.sign({ id: 'mockUserId' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    // Insert sample data
    const sample = await UserData.create({
      projectId: '67f0f998ffa3c7ddb547b5b9',
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

    projectId = sample.projectId;
  });

  afterAll(async () => {
    // Optional cleanup
    // await UserData.deleteMany({});
    // await mongoose.connection.close();
  });

  it('should return heatmap data for a valid projectId', async () => {
    const res = await request(app)
      .get(`/api/track/heatmap/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('x');
      expect(res.body.data[0]).toHaveProperty('y');
      expect(res.body.data[0]).toHaveProperty('intensity');
    }
  });
});
