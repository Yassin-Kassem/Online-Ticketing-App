require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const {MongoClient} = require('mongodb')


const app = express();
app.use(express.json())

const port = process.env.PORT || 5000



// start the server 
app.listen(port, () => console.log(`Server running on port ${port}`));