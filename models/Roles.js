const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// RoleSchema.pre("save", true, function(next, done,) {
//   var self = this
//   mongoose.models["role"].findOne({name : self.name, }, function(err, role) {
//       if(err) {
//           done(err);
//       } else if(role) {
//           self.invalidate("name", `Role with name(${self.name}) is already exist`);
//           done(new Error(`Role with name(${self.name}) is already exist`));
//       } else {
//           done();
//       }
//   });
//  next();
// });




module.exports = mongoose.model('role',  RoleSchema , 'roles' );