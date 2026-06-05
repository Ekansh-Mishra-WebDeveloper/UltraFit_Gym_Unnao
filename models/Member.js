// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoUrl: { type: String, default: 'defaultpfp.png' },
  age: { type: Number, required: true },
  since: { type: Date, default: Date.now },   // auto‑set to creation date
  experience: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
  goal: { type: String, enum: ['fatloss', 'musclegain'], default: 'musclegain' },
  featured: { type: Boolean, default: false },
  featuredTag: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  feeStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  position: { type: String, default: '' },
  feedback: { type: String, default: '' },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },   // NEW
  lastPaymentDate: { type: Date, default: null },
  membershipExpiry: { type: Date, default: null }
});

module.exports = mongoose.model('Member', memberSchema);