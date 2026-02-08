const mongoose=require("mongoose");
const quizQuestionSchema=new mongoose.Schema({
skill:{type:String,required:true},
question:{type:String,required:true},
options:{type:[String],required:true},
correctAnswer:{type:Number,required:true}
});
module.exports=mongoose.model("QuizQuestion",quizQuestionSchema);
