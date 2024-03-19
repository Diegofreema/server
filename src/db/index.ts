import mongoose from 'mongoose';
const url = process.env.MONGODB_URL!;
mongoose
  .connect(url)
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log('connection failed', err));
