const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");
const validator=require("validator");

const app=express();
dotenv.config();

const port=process.env.PORT || 3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.dnkemt2.mongodb.net/registrationFormDB`);

//Registration Schema
const registrationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your Name "],
        maxLength:[30,"Name cannotexceed 30 characters"],
        minLength:[4,"Name should have more than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password should be greater than 8 characters"],
        select:false
    }
})

//model of registration schema
const registration=mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})

app.post("/register",async(req,res)=>{
    try{
       const {name,email,password}= req.body;

       const existingUser=await registration.findOne({email : email});
     //check for existing User
       if(!existingUser){
       const registrationData=new registration({
        name,
        email,
        password
       });
     await  registrationData.save();
     res.redirect("/success");
    } 
    else {
        console.log("User already exist");
        res.redirect("/error");
    }
    }
    catch(error){
        console.log(error);
            res.redirect("/error")
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
