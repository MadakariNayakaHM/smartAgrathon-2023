const express= require('express');
const app= express();
const path = require('path');
const pug=require('pug');
const cookieParser=require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'));
const userRoutes=require('./routers/userRoutes');
app.use('/bugSlayers/user',userRoutes);
const analystRoutes=require('./routers/analystRoutes');
app.use('/bugSlayers/analyst',analystRoutes);
const dealersRoute=require('./routers/dealersRoutes');
app.use('/bugSlayers/dealers',dealersRoute);
const viewsRoutes=require('./routers/viewsRoutes');
app.use('/',viewsRoutes)
module.exports=app;
