require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const {MongoClient} = require('mongodb')


const app = express();
app.use(express.json())

const port = process.env.PORT || 5000

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong!' });
});

// start the server 
app.listen(port, () => console.log(`Server running on port ${port}`));