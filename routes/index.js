var express = require('express');
var router = express.Router();
const userModel = require("./users")
const upload = require("./multer");

const postModel = require("./Posts")
const localStrategy = require("passport-local");

const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',function(req, res, next) {
  res.render('login',{error:req.flash('error')});
});


router.get('/feed', function(req, res, next) {
  res.render('feed',);
});

//route for uploading on profile page
router.post('/upload', isLoggedIn,upload.single("file"),async function(req, res, next) {  //upload.single due to this line upload occurs
if(!req.file){
 return res.status(404).send("no files were given")
}
// jo bhi file upload hui hai use save karso as a post and uska postid user ko do and post ko user id do
const user = await userModel.findOne({username:req.session.passport.user})
const postdata = await postModel.create({
  image:req.file.filename,  //name of uploaded file
imageText:req.body.filecaption,
ser: user._id
})
 user.posts.push(postdata._id); //post id is assigned in users.js
await user.save();
 res.redirect("/profile")
});

router.post('/profile',isLoggedIn,function(req, res, next) {

  res.render("profile")
});

router.get('/profile',isLoggedIn,async function(req, res, next) {
const user = await userModel.findOne({
  username:req.session.passport.user
})
.populate("posts")
console.log(user)
  res.render("profile",{user})
});

router.post("/register",function(req,res){
//   let userData =  new userModel({
//  username: req.body.username,
//   email: req.body.email,
//   fullName: req.body.fullName
//   })
//OR you can write this
console.log(req.body)
const { username, email, fullname } = req.body;
let userData = new userModel({ username, email, fullname:fullname });

userModel.register(userData,req.body.password)
.then(function(){
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile")
  })
})

})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash :true
}),
  function(req,res){
})

router.get("/logout",function(req,res){
   req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;