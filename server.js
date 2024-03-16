const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

//Route files
const hospitals = require ('./routes/hospitals');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');

//Connect to database
connectDB();

//Load env vars
dotenv.config({path:'./config/config.env'});

//const app=express();
const app=express();
//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Mount routers
app.use('/api/v1/hospitals',hospitals); 
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);

//app.get('/', (req,res) => {
    //1. res.send('<h1>'Hello from express</h1>');
    //2. res.send({name:'Brad'});
    //3. res.json({name:'Brad'});
    //4. res.sendStatus(400);
    //5. res.status(400).json({success:false});
    //res.status(200).json({success:true, data:{id:1}});
//});
console.log('port', process.env.PORT);
const PORT=process.env.PORT || 5100;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, 'mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server % exit process
    server.close(()=>process.exit(1));
});