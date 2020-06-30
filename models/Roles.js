const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Please add a name'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});




module.exports = mongoose.model('role',  RoleSchema , 'roles' );