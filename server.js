// server.js

import express from 'express';
import router from './routes/index';

const app = express();

const PORT = process.env.PORT || 5000;
// Middleware to parse JSON in the request body
app.use(express.json());
// Middleware to parse URL-encoded data
//app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
