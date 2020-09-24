const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
//const ejs = require('ejs');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(express.static('public'));
//app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
})); 
app.use(
    session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true,
    })
  );

mongoose.connect('mongodb://localhost/tallyDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
  
const connection = mongoose.connection;
connection.once('open', () =>{
    console.log('MongoDB database connection establish successfully');
});
 
const userRouter = require('./routes/user.route');
app.use('/',userRouter);



app.listen(3000, () => {
    console.log('Server is running on port: 3001');
})