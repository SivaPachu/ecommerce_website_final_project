import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err.message));

// Health Check Route for Render
app.get('/', (req, res) => {
  res.send('NexusGear Backend API is running live!');
});

// 1. Register User
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, mobile, email, password, address, city, pincode } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered. Please Sign In.' });
    }
    const user = await User.create({ name, mobile, email, password, address, city, pincode });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      address: user.address,
      city: user.city,
      pincode: user.pincode
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Login User
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        city: user.city,
        pincode: user.pincode
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Create Order in MongoDB
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Get Orders by User Email
app.get('/api/orders/:email', async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));