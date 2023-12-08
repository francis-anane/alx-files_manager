import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const users = dbClient.db.collection('users');
    users.findOne({ email }, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (user) {
        return res.status(400).json({ error: 'Already exists' });
      }
      const hashPassword = sha1(password);
      users.insertOne({ email, password: hashPassword })
        .then((result) => {
          res.status(201).json({ email, id: result.insertedId });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        });

      return null;
    });
    return null;
  }

}

export default UsersController;
