// AppController.js

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const UsersController = {

  postNew: async (req, res) => {
    
    res.status(200).json({ users: usersCount, files: filesCount });
  },
};

export default UsersController;
