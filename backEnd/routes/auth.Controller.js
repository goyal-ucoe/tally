const User = require('../models/user.model');

exports.google = (req, res) => {
    authController(req, res);
}

exports.facebook = (req, res) => {
    authController(req, res);
}


 
function authController(req, res){
    console.log('Response ---> ', res.body);
    // Successfully authentication, redirect home
    // res.redirect("/");
    res.redirect("http://localhost:3001/sucessfull");
}

exports.upsertUserRecord = (accessToken, refreshToken, profile, cb, StrategyId, userObj) => {

    const email = userObj['email'];
    User.findOne({
      email: email,
    },(err, user) => {
          
      if(user){
        user.facebookId = profile.id;
        user.save()
        .then(() => {callback(cb,email)})
        .catch(err => cb(err, null));               
      }else{
        userObj = new User({...userObj,
            [StrategyId]: profile.id
            });
        userObj.save()
        .then(() => {callback(cb,email)})
        .catch(err => cb(err, null)); ;
      }
          
    });

}


function callback(cb,email){
    User.findOne({
        email: email,
      },(err, user) => {
        cb(null, user._id);
      });    
  }

