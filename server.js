require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes (same as before)
const trainerRoutes = require('./routes/trainers');
const memberRoutes = require('./routes/members');
const productRoutes = require('./routes/products');
const siteSettingsRoutes = require('./routes/siteSettings');
const statsRoutes = require('./routes/stats');
const transformationRoutes = require('./routes/transformations');
const dietPlanRoutes = require('./routes/dietPlans');
const workoutPlanRoutes = require('./routes/workoutPlans');
const membershipRoutes = require('./routes/memberships');
const galleryRoutes = require('./routes/gallery');
const reelRoutes = require('./routes/reels');
const reviewRoutes = require('./routes/reviews');
const contactInfoRoutes = require('./routes/contactInfo');
const dietCategoriesRoutes = require('./routes/dietCategories');
const dietMealsRoutes = require('./routes/dietMeals');
const workoutCategoriesRoutes = require('./routes/workoutCategories');
const workoutDaysRoutes = require('./routes/workoutDays');
const legalRoutes = require('./routes/legal');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== CORS CONFIGURATION (allow Authorization header) ==========
const corsOptions = {
  origin: true, // allow any origin (or specify your frontend URL)
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ekanshmishra124_db_user:jXNpKsmoGH2Oujas@ultrafit.9siu9qp.mongodb.net/ultrafit?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected to Atlas');
    console.log('📁 Database name:', mongoose.connection.name);
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API routes
app.use('/api/trainers', trainerRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sitesettings', siteSettingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/transformations', transformationRoutes);
app.use('/api/dietplans', dietPlanRoutes);
app.use('/api/workoutplans', workoutPlanRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contactinfo', contactInfoRoutes);
app.use('/api/dietcategories', dietCategoriesRoutes);
app.use('/api/dietmeals', dietMealsRoutes);
app.use('/api/workoutcategories', workoutCategoriesRoutes);
app.use('/api/workoutdays', workoutDaysRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('UltraFit Gym API is running 🏋️');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});