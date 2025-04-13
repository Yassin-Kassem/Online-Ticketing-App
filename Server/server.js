require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const {MongoClient} = require('mongodb')


const app = express();
app.use(express.json())

const port = process.env.PORT || 5000


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server running on port ${port}`));