const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const multer = require("multer");
const sharp = require("sharp");
const sendEmail=require('../email');
const signToken = (id) => 
{
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const createSendToken = (user, res) => 
{
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    Secure: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = async (req, res, next) => 
{
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    const token = signToken(newUser._id);
      const url=`${req.protocol}://${req.get('host')}/`
      const message=`you are added to our family Bug-Slayers click this link for login ${url}`
    try{
      await sendEmail({
      email:newUser.email,
      subject:`welcome mail from Bug Slayers`,
      message
    })} catch(err){console.log("error while sending email")}
    
  
    res
      .status(201)
      .json({ message: "success", token, data: { user: newUser } });
  } catch (err) {
    console.log("error at signup");
    console.log(err);
  }
};
module.exports.login = async (req, res, next) => 
{
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      res.status(401).render("error");
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(404).render("error");
    }
    const url=`${req.protocol}://${req.get('host')}/`
      const message=`you are added to our family Bug-Slayers click this link for interacion ${url}`
    try{
      await sendEmail({
      email:user.email,
      subject:`welcome mail from Bug Slayers you are loged in as ${user.name}\n Interact with the farmers , dealers and analyst for more benifits`,
      message
    })} catch(err){console.log("error while sending email")}
    if (user) {
      createSendToken(user, res);
      const token = signToken(user._id);
      res.status(200).json({ status: "success", token });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.protect = async (req, res, next) => 
{
  let token;
  try {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      res.status(400).render('error');
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    ).catch((err) => {
      res.status(400).render('error');
    });

    next();
  } catch (err) {
    console.log(err);
  }
};
exports.ristrictTo = (...roles) => 
{
  try {
    return async (req, res, next) => {
      let token;

      if (req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        res.status(404).render('error');
      }

      let decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
        function (err, decoded) {
          return decoded.id;
        }
      );
      let user = await User.findById(decoded);

      if (!roles.includes(user.roles) || !user) 
      {
        res
          .status(401)
          .render('error')
      }
      next();
    };
  } catch (err) {
    console.log(err);
  }
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => 
{
  try {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb((req, res) => {
        res
          .status(400)
          .json({ status: "success", message: "upload only photos" });
      }, false);
    }
  } catch (e) {
    console.log("error at multer filter");
    console.log(e);
  }
};

exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resizeUserImage = async (req, res, next) => 
{
  try {
    if (!req.file) return next();

    req.body.photo = `user-${Date.now()}-profile.jpeg`;
    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/images/userPhotos/${req.body.photo}`);

    next();
  } catch (e) {
    console.log("error at resizing the images");
  }
};

exports.updateMe = async (req, res, next) => 
{
  try {
    const userId = req.body.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        photo: req.body.photo,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: "success", data: { updatedUser } });
  } catch (e) {
    console.log("error at update user");
    console.log(e);
  }
};
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};