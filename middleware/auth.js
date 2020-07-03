const jwt = require('jsonwebtoken');
const User = require('../models/User');

//protect route

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //Make sure token is exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token is found'})
  }

  try {
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id).populate('roles', 'name');
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is not valid'})
  }
};

// Grant access to specific roles
exports.authorize =  (roles) => {
  //console.log("ttttttttttttttt",roles);
  return (req, res, next) => {
    // console.log("iiiiiiiiiii",req.user);
    if(req.user.roles.some(role => roles.includes(role.name))) {
     return  next();
    }
    return res.status(401).json({message: 'not have enough permission'})
    // if (!roles.includes(req.user.roles.some(restrictRoles))) {
    //   return res.status(401).json({ success: false, message: 'Not authorize to access these routes'})
    // }
    next();
  };
};