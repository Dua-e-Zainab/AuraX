const request = require('supertest');
const app = require('../app'); // adjust this path to where your Express app is exported
let token; // Assume you get a valid token before tests
let createdProjectId;

beforeAll(async () => {
  // Simulate user login or create user to get a valid token
  const res = await request(app)
    .post('/api/auth/login') // or register if needed
    .send({
      email: 'testuser@example.com',
      password: 'yourTestPassword123'
    });

  token = res.body.token;
});

describe('POST /api/projects/create', () => {
  it('should create a new project successfully', async () => {
    const response = await request(app)
      .post('/api/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        url: 'https://test.com',
        domain: 'test.com'
      });

    console.log('✅ Created Project Response:', response.body);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Project created successfully');
    expect(response.body.project).toHaveProperty('_id');
    createdProjectId = response.body.project._id;
  });

  it('should prevent duplicate domain names (case-insensitive)', async () => {
    const response = await request(app)
      .post('/api/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Duplicate Project',
        url: 'https://TEST.com',
        domain: 'TEST.com'
      });

    console.log('❌ Duplicate Domain Test Response:', response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('A project with this URL or Domain already exists.');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Incomplete Project',
        url: 'https://incomplete.com'
        // missing domain
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are required.');
  });

  it('should return 401 if token is not provided', async () => {
    const response = await request(app)
      .post('/api/projects/create')
      .send({
        name: 'Unauthorized Project',
        url: 'https://unauthorized.com',
        domain: 'unauthorized.com'
      });

    expect(response.status).toBe(401);
  });
});
