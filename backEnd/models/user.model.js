const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type:String,
        required: true,
        trim: true,
        minlength: 3
    },
    firstName: {
        type:String,
        required: true,
        trim: true,
        minlength: 3
    },
    lastName : {
        type:String,
        trim : true,
        minlength: 3
    },
    password:{
        type: String,
        trim:true,
        minlength:8
    },
    dateOfBirth : {
        type:Date,
        max : new Date()
    },
    googleId : {
        type: String
    },
    facebookId : {
        type: String
    },
    twitterId : {
        type: String
    },
    mobile1:{
        type:Number, 
        min: 10,
        max: 10
    },
    mobile2:{
        type:Number,
        min: 10,
        max: 10
    },
    phone:{
        type:Number
    },
    email:{
        type:String,
        required: true,
        unique:true
    },  
    email_verified:{
        type: Boolean,
        default:false
    },
    street:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    postalCode:{
        type:String,
        max:6
    },
    country:{
        type:String,
        max:25
    }
}, {
    timestamps: true
});

 userSchema.plugin(passportLocalMongoose,{usernameField : 'email', 
 saltlen: 64,
 keylen: 1024,
 iterations : 50000, 
 saltField : 'ganesha',
  hashField : 'hanumana',
  usernameLowerCase: true});
// userSchema.plugin(findOrCreate);

const User = mongoose.model('User',userSchema);

module.exports = User;