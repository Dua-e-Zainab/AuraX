const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/User');


jest.setTimeout(10000);

describe('Auth API Tests', () => {
    const existingUserEmail = 'testuser@example.com';
    const existingUserPassword = '123456';

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true

jest.setTimeout(30000);
describe('Auth API Tests', () => {

    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hassaan19:2xopP83rB@aurax.idvo9.mongodb.net/myDatabase?retryWrites=true&w=majority', {
           

        });

        const user = await User.findOne({ email: existingUserEmail });
        if (!user) {
            const hashedPassword = await bcrypt.hash(existingUserPassword, 10);
            await User.create({ email: existingUserEmail, password: hashedPassword });
        }
    });

    afterAll(async () => {


        // // Clean up database and close connection
        // await User.deleteMany();

        await mongoose.connection.close();
    });

    describe('Signup Route', () => {
        it('should create a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: `newuser_${Date.now()}@example.com`,
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
        });

        it('should not allow duplicate email registration', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: existingUserEmail,
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });

        it('should return an error for missing email or password', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: '', password: '' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email and password are required');
        });
    });

    describe('Login Route', () => {
        it('should log in successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: existingUserEmail,
                    password: existingUserPassword
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBeDefined();
        });

        it('should return an error for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: existingUserEmail,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should return an error for missing email or password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: '', password: '' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email and password are required');
        });
    });
});