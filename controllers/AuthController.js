import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    // Extract email and password from Authorization header (Basic Auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const credentials = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    // TODO: Check user credentials (compare with hashed password)
    // If no user found, return unauthorized
    // Otherwise, generate a token, store in Redis, and return it

    const token = uuidv4();
    const redisKey = `auth_${token}`;

    // Store user ID in Redis for 24 hours
    await redisClient.set(redisKey, userId, 'EX', 24 * 60 * 60);

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    // TODO: Retrieve user based on the token, delete the token in Redis
    // Return 401 if token not found, otherwise return 204 with no content
  }
}

export default AuthController;
