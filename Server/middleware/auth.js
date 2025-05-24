const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const auth = async(req, res, next) => {
  try {
      const token = req.cookies.jwt;
      if(!token){
        return res.status(401).json({message: "Not Authorized"});
      }

      //verify token
      const data = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(data.id);
      if(!user){
        res.status(400).json({message: "user not found"});
      }
      req.user = user;
      next();
  } catch (error) {
      console.log(error.message);
      res.status(400).json({message: "no token provided"});
  }
}


module.exports = {
  auth,
};