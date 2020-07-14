    
const express = require("express");
require("../models/user")
require("../models/post")
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post")


router.get("/allpost",(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")//all the post
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body} = req.body;
    if(!title || !body)
    {
        return res.status(422).json({error:"Please add all fields"})
    }
    const post = new Post({
        title,
        body,
        postedBy:req.user
        
    })
   
    post.save().then(result=>{
        res.json({message:result})
    })
    .catch(err=>{
        console.log("Error is: ",err)
    })
    
})

module.exports = router

