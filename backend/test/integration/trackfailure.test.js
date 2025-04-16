const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');

const dummyToken = jwt.sign({ id: 'dummyuser' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

describe("GET /api/track/heatmap/:projectId - Failure Cases", () => {
  it("should return 401 if token is missing", async () => {
    const res = await request(app).get("/api/track/heatmap/67f0f998ffa3c7ddb547b5b9");
    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.success).toBeDefined();
  });

  it("should return 403 if token is invalid", async () => {
    const res = await request(app)
      .get("/api/track/heatmap/12345")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(403);
    expect(res.body.message || res.body.success).toBeDefined();
  });

  it("should return 404 if projectId has no associated heatmap data", async () => {
    const res = await request(app)
      .get("/api/track/heatmap/67f0f998ffa3c7ddb547b5b9")
      .set("Authorization", `Bearer ${dummyToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No data found for this project.");
  });

  it("should return 500 if something goes wrong (simulate DB error)", async () => {
    const UserData = require('../../models/UserData');
    jest.spyOn(UserData, 'find').mockImplementation(() => {
      throw new Error('Simulated DB error');
    });

    const res = await request(app)
      .get("/api/track/heatmap/67f0f998ffa3c7ddb547b5b9")
      .set("Authorization", `Bearer ${dummyToken}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Server error.");

    jest.restoreAllMocks();
  });
});
