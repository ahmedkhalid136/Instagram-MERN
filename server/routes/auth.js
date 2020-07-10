const express = require("express");
const router = express.Router();
require("../models/user")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const User = mongoose.model("User");

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

module.exports = router;
