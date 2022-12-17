const User = require('./../models/userModel');
const Analyst = require('./../models/analystModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sharp = require('sharp');
const nodemailer=require('nodemailer')
const sendEmail=require('../email');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => 
{
    try
    {
      if (file.mimetype.startsWith('image')) {
        cb(null, true)

    }
    else {
        cb((req, res) => { res.status(404).json({ status: "success", message: "upload only photos" }) }, false);
    }
    }catch(e){console.log("error at analyst file filtrt")
  console.log(e)}
}

exports.upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter

}
)
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
          .toFile(`public/images/cropPhotos/${filename}`);
        req.body.cropPhoto.push(filename);
        console.log(req.files)
      })
    );
    next();
  } catch (e) {
    console.log("eror at resize analyst crop pic");
    console.log(e);
  }
};

exports.createPost = async (req, res, next) => 
{
try
{
  
  const token = req.cookies.jwt;
  const idUser = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => { return decoded.id })
  const createPost = await Analyst.create({ cropPhoto: req.body.cropPhoto, from: idUser, to: req.body.to, quantity: req.body.quantity, place: req.body.place, query: req.body.query });
  const user = await User.findOne({ _id: idUser })
  const user2= await User.findOne({_id:req.body.to})
  const dobj = Date.now();
  const date = new Date(dobj).getDate();
  const month = new Date(dobj).getMonth();
  const year = new Date(dobj).getFullYear();
  
  const updates = {
      reqName: req.body.query,
      requestededOn: `${date}/${month}/${year}`

  }

  user.reqAndRes.push(updates);
  user.save();
  try{
    await sendEmail({
    email:user.email,
    subject:`hi Farmer ${user.name} your post is submitted successfully`,
    message:` from Bug Slayers you have posted query as  ${user.name} to the analyst ${user2.name}\n please wait for some time until you get responded by the analyst`,
  })} catch(err){console.log("error while sending email")
console.log(err)}

  try{
    await sendEmail({
    email:user2.email,
    subject:`hi analyst ${user2.name} you have new post notification`,
    message:`welcome mail from Bug Slayers you have recived query as analyst,  ${user2.name} from the farmer ${user.name}\n please answer the query to solve his problem`,
  })} catch(err){console.log("error while sending email")}
  res.status(200).json({
      status: "success",
      data: createPost
  })
}catch(e){console.log("error at creating analyst post")
console.log(e)}
}

exports.acceptQuery= async (req,res,next)=>
{
 
 try{
  const reqId= req.body.reqId;
 const idUser = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => { return decoded.id })
 const user = await User.findOne({ _id: idUser })
 const dobj = Date.now();
 const date = new Date(dobj).getDate();
 const month = new Date(dobj).getMonth();
 const year = new Date(dobj).getFullYear();
const request= await Analyst.findOne({_id:reqId});
 const updates = {
     reqName:request.query,
     respondedOn: `${date}/${month}/${year}`

 }

 user.reqAndRes.push(updates);
 user.save();
 await Analyst.findByIdAndUpdate(reqId,{Accept:1, solution:req.body.solution},{new:true,runValidators:true})
 try{
  await sendEmail({
  email:user.email,
  subject:`hi analyst ${user.name} your query  is answered successfully`,
  message:` from Bug Slayers you have answered query as  ${user.name} to the farmer ${request.from.name}\n Thank you`,
})} catch(err){console.log("error while sending email")
console.log(err)}

try{
  await sendEmail({
  email:request.from.email,
  subject:`hi farmer ${request.from.name} you have new  notification of answered Query`,
  message:`welcome mail from Bug Slayers you have recived solution for query: ${request.query} a   from the analyst ${user.name}\n Thank you`,
})} catch(err){console.log("error while sending email"); console.log(err)}
 res.status(200).json({status:"success"})
 }catch(e)
 {
  console.log("error at accept query");
  console.log(e);
 }
}