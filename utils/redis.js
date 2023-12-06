// Import the 'redis' library
import redis from 'redis';
import { promisify } from 'util';

// Create a class named RedisClient to encapsulate Redis functionality
class RedisClient {
  constructor() {
    // Create a new Redis client
    this.client = redis.createClient();

    // Set up an error event listener to handle any errors that may occur
    this.client.on('error', (err) => console.log(`Client Error: ${err}`));
  }

  // Method to check if the Redis server is alive
  isAlive() {
    return this.client.connected; // return true / false
  }

  // Asynchronous method to get a value from Redis using a given key
  async get(key) {
    // Use the 'get' method of the Redis client to retrieve the value associated with the key
    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      return await getAsync(key);
    } catch (err) {
      console.error(`Error getting value from Redis: ${err}`);
      return null;
    }
  }

  // Asynchronous method to set a key-value pair in Redis with an optional expiration time
  async set(key, value, time) {
    // Use the 'set' method of the Redis client to set the key-value pair
    const setAsync = promisify(this.client.set).bind(this.client);
    try {
      await setAsync(key, value, 'EX', time);
    } catch (err) {
      console.log(`Error setting value for key ${key}: ${err}`);
    }
  }

  // Asynchronous method to delete a key from Redis
  async del(key) {
    // Use the 'del' method of the Redis client to delete the key
    const delAsync = promisify(this.client.del).bind(this.client);
    try {
      await delAsync(key);
    } catch (err) {
      console.log(`Error deleting value for ${key}: ${err}`);
    }
  }
}

// Create an instance of the RedisClient class
const redisClient = new RedisClient();

// Export the RedisClient instance for external use
export default redisClient;
