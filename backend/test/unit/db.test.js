const mongoose = require("mongoose");
const dotenv = require("dotenv");

jest.setTimeout(10000); 
dotenv.config();

beforeAll(async () => {
  // Connect to MongoDB before running tests
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    
  });
});

afterAll(async () => {


  // Close the MongoDB connection after tests
  await mongoose.connection.close();
});

test("Database connection should be successful", async () => {
  // Ensure connection is established
  expect(mongoose.connection.readyState).toBe(1); // 1 means connected
});