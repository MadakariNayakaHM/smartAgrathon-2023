const express=require('express');
const User=require('./../models/userModel');
const jwt=require('jsonwebtoken');
const Analyst=require('./../models/analystModel');
const dealers=require('./../models/dealersModel');
const path = require('path');
const Dealers = require('./../models/dealersModel');

exports.homePage=async (req,res,next)=>
{
try{
    let idUser;
    
    if(req.cookies.jwt)
    {
        
     idUser = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => { return decoded.id });
    }
    let user;
    
    const users=await User.find();
    if(idUser)
    {
         user= await User.findById(idUser);
    }
    
    if(user)
    {   const analyst= await Analyst.find();
        const dealer= await Dealers.find();

        res.status(200).render('base',{users, user, analyst ,dealer});
    }
    
    else
    {
    res.status(200).render('login');
    }
}catch(e){console.log("error at base view ");
console.log(e);}
}
exports.login=async (req,res,next)=>
{
   try{ res.status(200).render('login')}catch(e){console.log(e)}
}
exports.signup=async(req,res,next)=>
{
   try{ res.status(200).render('signup')}catch(e){console.log(e)}
}
exports.consultAnalyst= async (req,res,next)=>
{
    try{res.status(200).render('consultAnalyst');}catch(e){console.log(e)}
}
exports.aboutMe= async (req,res,next)=>
{
  try{ const idUser = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => { return decoded.id });
  const user= await User.findById(idUser);
  res.status(200).render('aboutme',{user});}catch(e){console.log(e)}
}
exports.updateUser=async (req,res,next)=>
{  
   try{ const user= await User.findById(req.params.id)
    res.status(200).render('updateMe' ,{user})}catch(e){console.log(e)}
}
exports.consultAnalyst=async (req,res,next)=>
{ 
   try{
    const analyst= await User.findById(req.params.anaId)
    res.status(201).render('consultAnalyst',{analyst})
   }catch(e){console.log(e)}
}
exports.answerQuery=async (req,res,next)=>
{   try{
    const request= await Analyst.findById(req.params.reqId)
    res.status(200).render('answerQuery',{request})
}catch(e){console.log(e)}
}

exports.consultDealer=async(req,res,next)=>
{
    try
    {
        const dealer= await User.findById(req.params.delId)
        res.status(200).render('consultDealer',{dealer})
    }
    catch(e)
    {

    }
}
exports.acceptDeal=async (req,res,next)=>
{   try{
    const deal= await Dealers.findById(req.params.dealId)
    console.log(deal)
    res.status(200).render('acceptDeal',{deal})
}catch(e){console.log(e)}
}
