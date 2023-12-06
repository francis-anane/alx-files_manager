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
    this.client.connect();
  }

  // Check if the MongoDB connection is alive
  isAlive() {
    return this.client.isConnected();
  }

  // Asynchronously get the number of user documents in the 'users' collection
  async nbUsers() {
    try {
      // Access the 'files_manager' database
      const db = this.client.db();

      // Access the 'users' collection within the database
      const collection = db.collection('users'); // Adjusted collection name

      // Retrieve the count of user documents in the collection
      const count = await collection.countDocuments();

      // Return the count of user documents
      return count;
    } catch (error) {
      // Log and handle errors that may occur during the operation
      console.error(`Error counting user documents: ${error}`);

      // Return null in case of an error
      return null;
    }
  }

  // Asynchronously get the number of file documents in the 'files' collection
  async nbFiles() {
    try {
      // Access the 'files_manager' database
      const db = this.client.db();

      // Access the 'files' collection within the database
      const collection = db.collection('files');

      // Retrieve the count of file documents in the collection
      const count = await collection.countDocuments();

      // Return the count of file documents
      return count;
    } catch (error) {
      // Log and handle errors that may occur during the operation
      console.error(`Error counting file documents: ${error}`);

      // Return null in case of an error
      return null;
    }
  }
}

// Create an instance of the DBClient class to export
const dbClient = new DBClient();

// Export the instantiated DBClient for use in other modules
export default dbClient;
