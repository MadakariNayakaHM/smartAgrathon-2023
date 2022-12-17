const mongoose = require('mongoose');
const dotenv= require('dotenv');
dotenv.config({path:'./config.env'});
const port = process.env.PORT || 8080;
const app = require('./app');
const DB= process.env.DATA_BASE;
try{
mongoose.connect(DB).then(()=>{console.log("database connected successfully")})
}catch(e){
    console.log("error in connecting to database")
}
app.listen(port,()=>{console.log(`app is running at the port ${port} and is in ${process.env.NODE_ENV} mode`)});
