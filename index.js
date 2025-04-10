require('dotenv').config(); 
const express=require("express");
const mongoose=require("mongoose");
const {userRouter}=require("./routes/user")
const jwt=require("jsonwebtoken");
const app=express();
app.use(express.json());
app.use("/user",userRouter);

async function main(){
    await mongoose.connect(process.env.MONGOURL);
    app.listen(3000,()=>{
        console.log("Server is Running");
    });
}

main();