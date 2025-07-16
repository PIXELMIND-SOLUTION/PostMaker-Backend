const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/authRoute');
const notiRoute = require('./routes/notificationRoute');
const cateRoute = require('./routes/categoryRoute');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', notiRoute);
app.use('/api', cateRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})  .then(() => {
    console.log('✅ MongoDB Connected')
  })
  .catch((err) => {
    console.log('Mongo Error:', err)}
);

// Start Server
const PORT = process.env.PORT || 5001;
 app.listen(PORT, () => {
    console.log(`🚀 server running on port ${PORT}`)
});