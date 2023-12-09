import sha1 from 'sha1'; // Library for hashing passwords using SHA-1
import { ObjectID } from 'mongodb'; // Library for creating MongoDB ObjectIDs
import Queue from 'bull'; // Library for handling job queues
import dbClient from '../utils/db'; // Custom module for interacting with the database
import redisClient from '../utils/redis'; // Custom module for interacting with Redis

// Creating a new Queue instance with a specified name and Redis connection string
const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

// Defining a class named UsersController to handle user-related operations
class UsersController {
  // Method for handling the creation of a new user
  static postNew(req, res) {
    // Extracting email and password from the request body
    const { email, password } = req.body;

    // Checking if email or password is missing
    if (!email) {
      // If email is missing, return a 400 Bad Request response
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      // If password is missing, return a 400 Bad Request response
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    // Accessing the 'users' collection from the database
    const users = dbClient.db.collection('users');

    // Checking if a user with the same email already exists
    users.findOne({ email }, (err, user) => {
      if (user) {
        // If a user with the same email exists, return a 400 Bad Request response
        res.status(400).json({ error: 'Already exist' });
      } else {
        // If the user does not exist, hash the password using SHA-1
        const hashedPassword = sha1(password);

        // Inserting the new user into the 'users' collection
        users.insertOne({ email, password: hashedPassword })
          .then((result) => {
            // If the user is successfully inserted, return a 201 Created response
            // along with the user ID and email
            res.status(201).json({ id: result.insertedId, email });

            // Adding a job to the queue for background processing
            userQueue.add({ userId: result.insertedId });
          })
          .catch((err) => console.log(err)); // Log any errors that occur during the insertion
      }
    });
  }

  // Method for retrieving information about the authenticated user
  static async getMe(req, res) {
    // Extracting the authentication token from the request header
    const token = req.header('X-Token');
    const key = `auth_${token}`;

    // Retrieving the user ID from Redis based on the authentication token
    const userId = await redisClient.get(key);

    // Checking if a user ID is found in Redis
    if (userId) {
      // Accessing the 'users' collection from the database
      const users = dbClient.db.collection('users');

      // Creating an ObjectID instance for the user ID
      const idObject = new ObjectID(userId);

      // Finding the user in the 'users' collection based on the user ID
      users.findOne({ _id: idObject }, (err, user) => {
        if (user) {
          // If the user is found, return a 200 OK response
          // along with the user ID and email
          res.status(200).json({ id: userId, email: user.email });
        } else {
          // If the user is not found, return a 401 Unauthorized response
          res.status(401).json({ error: 'Unauthorized' });
        }
      });
    } else {
      // If the user ID is not found in Redis, log a message and return a 401 Unauthorized response
      console.log('User ID not found in Redis!');
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

// Exporting the UsersController class as the default export
export default UsersController;
