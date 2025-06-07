// C:\Users\weiqi\Miaomiao2\index.js
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const protectedRoutes = require('./routes/protectedRoutes'); 
const mealRoutes = require('./routes/mealRoutes');
const nutritionHistoryRoutes = require("./routes/nutritionHistoryRoutes");
const manualWorkoutRoutes = require('./routes/manualWorkoutRoutes'); 
const workoutPlanRoutes = require("./routes/workoutPlansRoutes");
const workoutHistoryRoutes = require('./routes/workoutHistoryRoutes');

const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB(); 

app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Specific route to serve the reset-password.html file
// This is needed because the email link goes to '/reset-password' (no .html extension)
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'reset-password.html'));
});

// Main homepage route, serves mainpage.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'mainpage.html'));
});

app.use('/', authRoutes);
app.use(mealRoutes);
app.use(nutritionHistoryRoutes);
app.use("/api/workouts", manualWorkoutRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);
app.use("/api/workout-history", workoutHistoryRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'mainpage.html'));
});

app.use('/private', protectedRoutes);

app.use((req, res) => {
    res.status(404).send('Sorry, the page you are looking for was not found!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.use(express.static(path.join(__dirname, "frontend", "public")));
app.use(express.static(path.join(__dirname, "frontend", "private")));