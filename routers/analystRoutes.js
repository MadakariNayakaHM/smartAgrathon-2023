const express= require('express');
const Router= express.Router();
const authController= require('./../controllers/authController');
const analystController=require('./../controllers/analystPost');
 
 Router.route('/acceptQuery').patch(analystController.acceptQuery);
 module.exports=Router;