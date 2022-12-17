const User = require("./../models/userModel");
const dealers = require("./../models/dealersModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");
const sendEmail=require('../email');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
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
    console.log("error at dealers file filtrt");
    console.log(e);
  }
};

exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.resizePhoto = async (req, res, next) => {
  try {
    req.body.cropPhoto = [];
    await Promise.all(
      req.files.map(async (file, i) => {
        const filename = `crop-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/images/qualityPhotos/${filename}`);
        req.body.cropPhoto.push(filename);
      })
    );
    next();
  } catch (e) {
    console.log("eror at resize dealers crop pic");
    console.log(e);
  }
};
exports.createPost = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const idUser = jwt.verify(
      req.cookies.jwt,
      process.env.JWT_SECRET,
      (err, decoded) => {
        return decoded.id;
      }
    );
    const createPost = await dealers.create({
      cropPhoto: req.body.cropPhoto,
      from: idUser,
      to: req.body.to,
      quantity: req.body.quantity,
      place: req.body.place,
      expectedPrice: req.body.expectedPrice,
    });
    const user = await User.findOne({ _id: idUser });
    const user2=await User.find({_id:req.body.to});
    const dobj = Date.now();
    const date = new Date(dobj).getDate();
    const month = new Date(dobj).getMonth();
    const year = new Date(dobj).getFullYear();
    const updates = {
      reqName: `dealer ${req.body.to}`,
      requestededOn: `${date}/${month}/${year}`,
    };
    user.reqAndRes.push(updates);
    user.save();
    try{
      await sendEmail({
      email:user.email,
      subject:`hi Farmer ${user.name} your post is submitted successfully`,
      message:` from Bug Slayers you have posted query as  ${user.name} to the dealer ${user2.name}\n please wait for some time until you get responded by the dealer`,
    })} catch(err){console.log("error while sending email")
  console.log(err)}
  
    try{
      await sendEmail({
      email:user2.email,
      subject:`hi analyst ${user2.name} you have new post notification`,
      message:`welcome mail from Bug Slayers you have recived deal request as dealer,  ${user2.name} from the farmer ${user.name}\n please reply to the farmer `,
    })} catch(err){console.log("error while sending email")}
    res.status(200).json({
      status: "success",
      data: createPost,
    });
  } catch (e) {
    console.log("error at creating analyst post");
    console.log(e);
  }
};

exports.acceptDeal = async (req, res, next) => {
  try {
    const dealId = req.body.dealId;
    const idUser = jwt.verify(
      req.cookies.jwt,
      process.env.JWT_SECRET,
      (err, decoded) => {
        return decoded.id;
      }
    );
    const user = await User.findOne({ _id: idUser });
    const dobj = Date.now();
    const date = new Date(dobj).getDate();
    const month = new Date(dobj).getMonth();
    const year = new Date(dobj).getFullYear();
    const request = await dealers.findOne({ _id: dealId });
    const updates = {
      reqName: `dealer ${idUser}`,
      respondedOn: `${date}/${month}/${year}`,
    };
    user.reqAndRes.push(updates);
    user.save();
    await dealers.findByIdAndUpdate(
      dealId,
      { Accept: 1, qualityCheck: 1 ,aggrement:{text:req.body.text,agreed:req.body.agreed}},
      { new: true, runValidators: true }
    );

    try{
      await sendEmail({
      email:user.email,
      subject:`hi dealer ${user.name}  deal is accepted successfully`,
      message:` from Bug Slayers you have accepted deal as  ${user.name} of the farmer ${request.from.name}\n Thank you`,
    })} catch(err){console.log("error while sending email")
    console.log(err)}
    
    try{
      await sendEmail({
      email:request.from.email,
      subject:`hi farmer ${request.from.name} you have new  notification of accepted deal`,
      message:` from Bug Slayers your deal is accepted to the price: ${request.expectedPrice}   from the dealer ${user.name}\n Thank you`,
    })} catch(err){console.log("error while sending email"); console.log(err)}
    res.status(200).json({ status: "success" });
  } catch (e) {
    console.log("error at accept deal");
    console.log(e);
  }
};
exports.bargainPrice=async (req,res,next)=>
{
try{
  await dealers.findByIdAndUpdate(
    dealId,
    { bargain:{bargainPrice:req.body.bargainPrice}},
    { new: true, runValidators: true }
  );

}catch(e){console.log("erroe at bargain dealer")
console.log(e)}
}