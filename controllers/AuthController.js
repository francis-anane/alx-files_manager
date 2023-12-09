import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    // Extract email and password from Authorization header (Basic Auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const credentials = Buffer.from(authHeader.slice('Basic '.length), 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    const hashedPassword = sha1(password);

    // If no user found, return unauthorized
    // Otherwise, generate a token, store in Redis, and return it
    
    const users = dbClient.db.collection('users');
    users.findOne({email, password: hashedPassword}, async (err, user) =>{
      if(user){
        const token = uuidv4();
        const redisKey = `auth_${token}`;
        // Store user ID in Redis for 24 hours
        await redisClient.set(redisKey, user._id.toString(), 'EX', 24 * 60 * 60);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    });

  }

  static async getDisconnect(req, res) {
    // Retrieve user based on the token, delete the token in Redis
    // Return 401 if token not found, otherwise return 204 with no content
    const token = request.header('X-Token');
    const redisKey = `auth_${token}`;
    const id = await redisClient.get(redisKey);
    if (id) {
      await redisClient.del(redisKey);
      res.status(204).json({});
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

export default AuthController;
