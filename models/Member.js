// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoUrl: { type: String, required: true },
  age: { type: Number, required: true },
  since: { type: String, required: true },
  experience: { type: String, enum: ['beginner', 'intermediate', 'expert'], required: true },
  goal: { type: String, enum: ['fatloss', 'musclegain'], required: true },
  featured: { type: Boolean, default: false },
  featuredTag: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  feeStatus: { type: String, enum: ['paid', 'unpaid'], default: 'paid' },   // <-- NEW FIELD
  position: { type: String, default: '' },
  feedback: { type: String, default: '' }
});

module.exports = mongoose.model('Member', memberSchema);