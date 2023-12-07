// Import the required MongoDB library
import { MongoClient } from 'mongodb';

// Define a class for managing the MongoDB connection and performing database operations
class DBClient {
  // Constructor to initialize the MongoDB connection
  constructor() {
    // Retrieve database connection details from environment variables or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // Construct the MongoDB connection URI
    const uri = `mongodb://${host}:${port}/${database}`;

    // Create a new MongoClient instance with provided URI and options
    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Establish an asynchronous connection to MongoDB in the constructor
    this.client.connect().then(() => {
      this.db = this.client.db(`${database}`);
    }).catch((err) => {
      console.log(`Error: ${err}`);
    });
  }

  // Check if the MongoDB connection is alive
  isAlive() {
    return this.client.isConnected();
  }

  // Asynchronously get the number of user documents in the 'users' collection
  async nbUsers() {
    // Access the 'users' collection within the database
    const users = this.db.collection('users'); // Adjusted collection name

    // Retrieve the count of user documents in the collection
    const count = await users.countDocuments();

    // Return the count of user documents
    return count;
  }

  // Asynchronously get the number of file documents in the 'files' collection
  async nbFiles() {
    // Access the 'files' collection within the database
    const files = this.db.collection('files');

    // Retrieve the count of file documents in the collection
    const count = await files.countDocuments();
    return count;
  }
}

// Create an instance of the DBClient class to export
const dbClient = new DBClient();

// Export the instantiated DBClient for use in other modules
export default dbClient;
