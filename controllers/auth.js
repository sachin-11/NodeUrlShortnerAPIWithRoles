const User = require('../models/User');

//@desc Register user
//@route POST /api/v1/auth/register
//@access public

exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
};

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
  const user = await User.findOne({ email }).select('+password');

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

//@desc Get looged in user
//@route POST /api/v1/auth/me
//@access private

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};