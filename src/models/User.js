const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      firstName: String,
      lastName: String,
      experience: String,
      age: String,
      gender: String,
      maxHeartRate: String,
      restingHeartRate: String,
      trainingFrequency: String,
      sportsBackground: String,
      targetRaces: String,
      targetDistance: String,
      targetMonth: String,
      dataUsageConsent: Boolean,
      notificationConsent: Boolean,
    },
    preferences: {
      newsletter: Boolean,
    },
    goals: {},
    trainingPlan: { type: Array, default: [] },
  },
  { timestamps: true }
);

// PAS de bcrypt ici !

const User = mongoose.models.User || mongoose.model('User', userSchema, 'auth_users');
module.exports = User;
