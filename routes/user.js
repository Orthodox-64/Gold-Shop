const express=require("express");
const bcrypt=require("bcrypt");
const Router=express.Router;
const jwt=require("jsonwebtoken");
const {z}=require('zod');
const {userMiddleware}=require("../middleware/user");
const {JWT_PASSWORD}=require("../config");
const { userModel } = require("../db");
const e = require("express");
const user = require("../middleware/user");
const userRouter=express.Router();

userRouter.post("/signup",async function(req,res){
    const requiredbody=z.object({
        email:z.string().min(4).max(40).email(),
        password:z.string().min(5).max(99)
    })
    const parseData=requiredbody.safeParse(req.body);
    const email=req.body.email;
    const password=req.body.password;
    const hashedpassword=await bcrypt.hash(password,5);
    if(!parseData.success){
        res.json({
            msg:"invalid input",
            error:parseData.error
        })
    }
    try{
        await userModel.create({
            email:email,
            password:hashedpassword
        })
    }
    catch(e){
        console.log(e.error);
        res.json({
            msg:"Error Occured"
        })
    }
    res.json({
        msg:"Signed Up"
    })
})
    userRouter.post("/signin",async function(req,res){
        const {email,password}=req.body;
        const user=await userModel.findOne({
            email:email
        })
    const passwordmatch=await bcrypt.compare(password,user.password);
    if(!passwordmatch){
        return res.status(403).json({
            msg:"Invalid Credentials"
        })
    }
    if(user){
        const token=jwt.sign({
            id:user._id
        },JWT_PASSWORD);
        res.json({
            token:token
        })
    }
    else{
        res.status(403).json({
            msg:"Invalid Credentials"
        })
    }
})

module.exports={
    userRouter
}