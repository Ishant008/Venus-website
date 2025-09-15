const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require("cors");

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend URL
  credentials: true                // allow cookies (important for JWT in cookies)
}));

app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/vacancies', require('./routes/vacancyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); 
app.use('/api/applicants', require('./routes/applicantRoutes'));  

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
