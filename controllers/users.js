const User  = require('../models/User');
const Role = require('../models/Roles');

//@desc Get all user
//@route GET /api/v1/users
//@access Private/Admin


exports.getUsers = async (req, res, next ) => {
    try {
        const user = await User.find()
        res.status(200).json({ success: true, data: user})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server Error'})
    }
}


// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = async (req, res, next) => {
     try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
          success: true,
          data: user
        });
         
     } catch (error) {
         console.error(error.message);
         res.status(500).json({ success: false, message: 'Server Error'})
     }
  };
  
  // @desc      Create user
  // @route     POST /api/v1/users
  // @access    Private/Admin
  exports.createUser = async (req, res, next) => {
     try {
           const user = await User.create(req.body);
  
        res.status(201).json({
          success: true,
          data: user
        });
         
     } catch (error) {
         console.error(error.message);
         res.status(500).json({ success: false, message: 'Server Error'})
     }
  };
  
  // @desc      Update user
  // @route     PUT /api/v1/users/:id
  // @access    Private/Admin
  exports.updateUser = async (req, res, next) => {
      try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
          });
        
          res.status(200).json({
            success: true,
            data: user
          });
      } catch (error) {
          console.error(error.message);
          res.status(500).json({ success: false, message: 'Server Error'})
      }
  };
  
  // @desc      Delete user
  // @route     DELETE /api/v1/users/:id
  // @access    Private/Admin
  exports.deleteUser = async (req, res, next) => {
       try {
        await User.findByIdAndDelete(req.params.id);
  
        res.status(200).json({
          success: true,
          data: {}
        });
       } catch (error) {
          console.error(error.message);
          res.status(500).json({ success: false, message: 'Server Error'}) 
       }
  };


  exports.getRolebyId = async (req, res, next ) => {
    try {
      let role = await Role.create(req.body);
      let user  = await User.findOneAndUpdate({ _id: req.params.id}, { $push: { roles: role._id}}, { new: true });
      res.status(200).json(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Server Error'})
    }
  }

