const quizResult=require("../Model/quizResult");
const application=require("../Model/application");
const notification=require("../Model/notification");
const quizQuestion=require("../Model/quizQuestion");
const {sendEmail}=require("../utils/emailService");
const saveQuizResult=async(req,res)=>{
const {candidateEmail,skill,score,totalQuestions,correctAnswers,timeTaken}=req.body;
try{
const newResult=new quizResult({candidateEmail,skill,score,totalQuestions,correctAnswers,timeTaken});
await newResult.save();
res.status(201).json({success:true,message:"Quiz result saved"});
}catch(err){
console.error("Error saving quiz result:",err);
res.status(500).json({success:false,error:err.message});
}
};
const getQuizResults=async(req,res)=>{
const {email}=req.query;
try{
const results=await quizResult.find({candidateEmail:email}).sort({completedDate:-1});
const allResults=await quizResult.find({});
const resultsWithPercentile=results.map(result=>{
const skillResults=allResults.filter(r=>r.skill===result.skill);
const betterScores=skillResults.filter(r=>r.score<result.score).length;
const percentile=skillResults.length>1?Math.round((betterScores/skillResults.length)*100):100;
return{...result.toObject(),percentile};
});
res.status(200).json({success:true,results:resultsWithPercentile});
}catch(err){
console.error("Error fetching quiz results:",err);
res.status(500).json({success:false,error:err.message});
}
};
const updateApplicationStatus=async(req,res)=>{
const {candidateEmail,internshipTitle,status,interviewDate,interviewTime,interviewLink}=req.body;
try{
const updateData={status};
if(interviewDate)updateData.interviewDate=interviewDate;
if(interviewTime)updateData.interviewTime=interviewTime;
if(interviewLink)updateData.interviewLink=interviewLink;
const updated=await application.findOneAndUpdate(
{candidateEmail,internshipTitle},
updateData,
{new:true}
);
if(!updated){
return res.status(404).json({success:false,error:"Application not found"});
}
let message;
let emailSubject;
let emailHtml;
if(status==='Shortlisted'){
message=`Congratulations! You have been shortlisted for ${internshipTitle} at ${updated.companyName}.`;
emailSubject='Congratulations! You are Shortlisted';
emailHtml=`<h2>${emailSubject}</h2><p>${message}</p><p>Check your dashboard for more details.</p>`;
}else if(status==='Interview Scheduled'){
message=`Your interview for ${internshipTitle} at ${updated.companyName} has been scheduled.`;
if(interviewDate)message+=` Date: ${interviewDate}`;
if(interviewTime)message+=` Time: ${interviewTime}`;
emailSubject='Interview Scheduled';
emailHtml=`<h2>Interview Scheduled</h2><p>Dear Candidate,</p><p>Your interview for <strong>${internshipTitle}</strong> at <strong>${updated.companyName}</strong> has been scheduled.</p>`;
if(interviewDate)emailHtml+=`<p><strong>Date:</strong> ${interviewDate}</p>`;
if(interviewTime)emailHtml+=`<p><strong>Time:</strong> ${interviewTime}</p>`;
if(interviewLink)emailHtml+=`<p><strong>Join Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>`;
emailHtml+=`<p>Please be on time. Good luck!</p><p>Best regards,<br>Jobsy Team</p>`;
}else{
message=`Your application for ${internshipTitle} at ${updated.companyName} has been ${status.toLowerCase()}.`;
emailSubject=`Application ${status}`;
emailHtml=`<h2>${emailSubject}</h2><p>${message}</p><p>Check your dashboard for more details.</p>`;
}
await notification.create({
candidateEmail,
message,
type:status,
internshipTitle,
companyName:updated.companyName
});
try{
await sendEmail(candidateEmail,emailSubject,emailHtml);
}catch(emailErr){
console.error('Email send failed:',emailErr);
}
res.json({success:true,message:"Status updated"});
}catch(err){
console.error("Error updating status:",err);
res.status(500).json({success:false,error:err.message});
}
};
const getQuizQuestions=async(req,res)=>{
const {skill}=req.query;
try{
const questions=await quizQuestion.find({skill});
res.status(200).json({success:true,questions});
}catch(err){
console.error("Error fetching questions:",err);
res.status(500).json({success:false,error:err.message});
}
};
module.exports={saveQuizResult,getQuizResults,updateApplicationStatus,getQuizQuestions};
