const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Member = require('../models/Member');
const StaffTrainer = require('../models/StaffTrainer');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/authMiddleware'); // your existing auth middleware

// All routes are protected with admin authentication
router.use(protect);

// GET /api/admin/payments – all payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/members – all members
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/members – add a new member
router.post('/members', async (req, res) => {
  try {
    const { name, age, gender, phone, photoUrl, experience, goal, status, feeStatus } = req.body;
    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age are required' });
    }
    const newMember = new Member({
      name,
      age,
      gender,
      phone,
      photoUrl: photoUrl || 'defaultpfp.png',
      since: new Date(),
      experience: experience || 'beginner',
      goal: goal || 'musclegain',
      status: status || 'active',
      feeStatus: feeStatus || 'unpaid'
    });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/trainers – all trainers (staff)
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await StaffTrainer.find();
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/attendance/all-members – member attendance heatmap data
router.get('/attendance/all-members', async (req, res) => {
  try {
    const records = await Attendance.find({ type: 'member' });
    const map = {};
    records.forEach(rec => {
      if (rec.memberId) {
        if (!map[rec.memberId]) map[rec.memberId] = [];
        map[rec.memberId].push(rec.date);
      }
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/attendance/trainer/all – all trainer attendance records (for hours & leaves)
router.get('/attendance/trainer/all', async (req, res) => {
  try {
    const records = await Attendance.find({ type: 'trainer' });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/attendance/stats/members – daily count of members present
router.get('/attendance/stats/members', async (req, res) => {
  try {
    // Count distinct members who checked in per day
    const records = await Attendance.aggregate([
      { $match: { type: 'member', checkinTime: { $exists: true, $ne: null } } },
      { $group: { _id: { date: '$date', memberId: '$memberId' } } },
      { $group: { _id: '$_id.date', count: { $sum: 1 } } },
      { $project: { date: '$_id', count: 1, _id: 0 } }
    ]);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/attendance/member – record member check‑in/out (for admin)
router.post('/attendance/member', async (req, res) => {
  try {
    const { memberId, action } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const shift = new Date().getHours() >= 12 ? 'evening' : 'morning';
    let record = await Attendance.findOne({ type: 'member', memberId, date: today, shift });
    if (!record) {
      record = new Attendance({ type: 'member', memberId, date: today, shift });
    }
    if (action === 'checkin') {
      record.checkinTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      record.status = 'present';
    } else if (action === 'checkout') {
      record.checkoutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    await record.save();
    res.json({ record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;