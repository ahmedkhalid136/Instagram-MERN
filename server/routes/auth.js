const express = require("express");
const router = express.Router();
require("../models/user")
const requirelogin = require("../middleware/requireLogin")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const User = mongoose.model("User");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../keys")

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the fields" });
  } 

  User.findOne({email:email})
  .then((saved)=>{
      if(saved)
      {
           return res.status(422).json({error:"User Already Exists"})   
      }
          bcrypt.hash(password,12)
          .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
            user.save()
            .then(savemessage =>{
                res.json({message:"Saved Successfully"})
            })
            .catch(err=>
              {
                  console.log(err)
              })
        
          })  
          
  })
  .catch(err=>{
      console.log(err)
  })
});

router.get("/protected",requirelogin,(req,res)=>{
  res.send("Hello MY Friend")
})

router.post("/signin",(req,res)=>{
  const {email,password}=req.body
  if(!email || !password)
  {
   return res.status(422).json({error:"Enter add email or password"})
  }
  User.findOne({email:email})
  .then(saveduser=>{
    if(!saveduser)
    {
      return res.status(422).json({error:"Invalid Email or Password"})
    }
    bcrypt.compare(password,saveduser.password)
    .then(domatch=>
      {
        if(domatch)
        {
          // res.json({message:"Successfully signed in"})

          const token = jwt.sign({_id:saveduser._id},JWT_SECRET)
          res.json({token})
        }
        else{
          return res.status(422).json({error:"Invalid Email or Password"})
        }
      })
      .catch(err=>{
        console.log(err)
      })
  })
})

module.exports = router;
