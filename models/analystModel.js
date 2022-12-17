const mongoose= require('mongoose');
const validator=require('validator');
const bcrypt= require('bcryptjs');
const analystSchema=mongoose.Schema({
    analyPost:String,
    from:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'you should have posts related to an analysts']
      },
      to: {

        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'should belongs to analyst']
      },
      cropPhoto:[String],
      quantity:String,
      place:String,
      query:String,
      Accept:
      {
        type:Number,
        min:0,
        max:1,
        default:0
      },
      solution:{type:String,
      default:"Not answered"}

})


analystSchema.pre(/^find/, function(next) {
    
  
    this.populate({
      path: 'from',
      select: 'name photo phone email sum'
    });
    next();
  });
  analystSchema.pre(/^find/, function(next) {
    
  
    this.populate({
      path: 'to',
      select: 'name photo phone email sum '
    });
    next();
  });


  

  
  

  const Analyst = mongoose.model("Analyst", analystSchema);
module.exports = Analyst;



    

