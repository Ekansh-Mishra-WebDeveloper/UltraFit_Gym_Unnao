require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI;

const debug = async () => {
  await mongoose.connect(MONGODB_URI);
  const admins = await Admin.find({});
  console.log('Admins found:', admins.length);
  for (let a of admins) {
    console.log(`Email: "${a.email}"`);
    console.log(`Password hash: ${a.password}`);
    console.log(`Hash length: ${a.password.length}`);
  }
  process.exit();
};
debug();