// AppController.js

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      return res.status(200).json({ redis: true, db: true });
    }
    return null;
  }

  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    return res.status(200).json({ users: usersCount, files: filesCount });
  }
}

export default AppController;
