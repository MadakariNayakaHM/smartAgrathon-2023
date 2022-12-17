const express= require('express');
const Router= express.Router();
const authController= require('./../controllers/authController');
const dealersController=require('./../controllers/dealersController');
 
 Router.route('/acceptDeal').patch(dealersController.acceptDeal);
 module.exports=Router;