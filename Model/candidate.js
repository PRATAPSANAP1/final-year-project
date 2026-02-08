const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://vaibhavsalve645_db_user:e15Mj0cuqyd4gmFE@cluster0.xxxxx.mongodb.net/Jobsy?retryWrites=true&w=majority/Jobsy")
.then(()=>{console.log("Mongo connected for candidate")})
.catch((err)=>console.log("error of mongo candidate : ",err))
const candidateSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true
    },
    Resume:{
        type:String,
        required:false
    },
    Portfolio:{
        type:String,
        required:false
    },
    Linkedin:{
        type:String,
        required:false
    },
    Education:{
        type:String,
        required:false
    },
    College:{
        type:String,
        required:false
    },
    Major:{
        type:String,
        required:false
    },
    Year:{
        type:String,
        required:false
    },
    Skills:{
        type:String,
        required:false
    },
    Location:{
        type:String,
        required:false
    },
    Password:{
        type:String,
        required:true
    },
    ConPassword:{
        type:String,
        required:true
    }
});
const candidateModel=mongoose.model("candidate",candidateSchema);

module.exports=candidateModel;
