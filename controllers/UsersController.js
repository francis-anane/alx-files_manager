import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');
    users.findOne({ email }, (err, user) => {
      if (user) {
        res.status(400).json({ error: 'Already exists' });
      } else {
        const hashPassword = sha1(password);
        users.insertOne({ email, password: hashPassword })
          .then((result) => {
            res.status(201).json({ id: result.insertedId, email });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }

  static async getMe() {

  }
}

export default UsersController;
