const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
