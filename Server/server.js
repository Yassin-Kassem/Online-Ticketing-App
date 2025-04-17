require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDb = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes')
const cookieParser = require("cookie-parser")
const { auth } = require('./middleware/auth')
const bookingRoutes = require('./routes/bookingRoutes')

// setup middleware
const app = express();
app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 5000

// connect to database
connectDb();

// setup routes
app.use("/api/v1/auth", auth)
app.use("/api/v1/users" , userRoutes)
app.use("/api/v1/events", eventRoutes)
app.use("/api/v1/bookings", bookingRoutes)


// start the server 
app.listen(port, () => console.log(`Server running on port ${port}`));