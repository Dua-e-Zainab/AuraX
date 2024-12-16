const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app'); 
const User = require('../models/User');

describe('Auth API Tests', () => {
    beforeAll(async () => {
        // Connect to the test database
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hassaan19:2xopP83rB@aurax.idvo9.mongodb.net/myDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Seed the database with a test user
        const hashedPassword = await bcrypt.hash('123456', 10);
        await User.create({ email: 'testuser@example.com', password: hashedPassword });
    });

    // afterAll(async () => {
    //     // Clean up database and close connection
    //     await User.deleteMany();
    //     await mongoose.connection.close();
    // });

    describe('Signup Route', () => {
        it('should create a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'newuser@example.com', password: 'password123' });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
        });

        it('should not allow duplicate email registration', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ email: 'testuser@example.com', password: 'password123' });

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
                .send({ email: 'testuser@example.com', password: '123456' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.token).toBeDefined();
        });

        it('should return an error for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'wrongpassword' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid email or password');
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
