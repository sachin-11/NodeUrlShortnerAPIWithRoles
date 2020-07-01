const User = require('../models/User');
const Roles = require('../models/Roles');


//@desc Register user
//@route POST /api/v1/auth/register
//@access public

exports.register = async (req, res, next) => {
  //create user
  const user = new User(req.body)
  const roles = await  Roles.findOne({ name: 'user'})
  user.roles = roles._id
  await user.save((err,data) => {
    if (err) {
      return res.status(404).json({ success: false, message: 'Register failed'})
    } 
    sendTokenResponse(data, 200, res);
  })
};

exports.getRolebyId = async (req, res, next ) => {
  try {
    let role = await Roles.create(req.body);
    let user  = await User.findOneAndUpdate({ _id: req.params.id}, { $push: { roles: role._id}}, { new: true });
    res.status(200).json(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server Error'})
  }
}


//@desc Login user
//@route POST /api/v1/auth/login
//@access private

exports.login =  async(req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'please provide valid email and passowrd'})
  }

  //check user exists
  const user = await User.findOne({ email }).select('+password').populate('roles','name');
  console.log(user)

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credientials'})
  }

  //check if password is correct
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credientials'})
  }

  sendTokenResponse(user, 200, res);
};

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};


//@desc Get looged in user
//@route POST /api/v1/auth/me
//@access private

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('roles', 'name');

  res.status(200).json({
    success: true,
    data: user,
  });
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};




