const mongoose= require('mongoose');
const validator=require('validator');
const bcrypt= require('bcryptjs');
const dealersSchema=mongoose.Schema({
    analyPost:String,
    from:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'you should have posts related to an dealerss']
      },
      to: {

        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'only user can upload the images']
      },
      cropPhoto:[String],
      quantity:String,
      place:String,
      expectedPrice:Number,
      Accept:{
        type:Number,
        min:0,
        max:1,
        default:0
      },
      qualityCheck:{
        type:Number,
        min:0,
        max:1,
        default:0

      },
      aggrement:{
        text:String,

        agreed:{type:Number,
            min:0,
            max:1,
            default:0
        }
      },
      bargain:{
        bargainAgree:{
          type:String,
          default:"no bargaining"
        },
        status:{type:Number,
        default:0},
        bargainedAmount:{
          type:Number,
          default:0
        }

      }
      


})


dealersSchema.pre(/^find/, function(next) {
    
  
    this.populate({
      path: 'from',
      select: 'name photo phone email sum '
    });
    next();
  });
  dealersSchema.pre(/^find/, function(next) {
    
  
    this.populate({
      path: 'to',
      select: 'name photo phone email sum'
    });
    next();
  });


  

  
  

  const Dealers = mongoose.model("dealers", dealersSchema);
module.exports = Dealers;



    

