const application=require("../Model/application");
const candidate=require("../Model/candidate");
const savedInternship=require("../Model/savedInternship");
const {sendEmail}=require("../utils/emailService");
const applyInternship=async(req,res)=>{
const {candidateEmail,internshipId,internshipTitle,companyName,location,stipend}=req.body;
try{
const user=await candidate.findOne({Email:candidateEmail});
if(!user){
return res.status(404).json({error:"Candidate not found"});
}
const existing=await application.findOne({candidateEmail,internshipId});
if(existing){
return res.status(400).json({error:"Already applied"});
}
const newApp=new application({
candidateEmail,
candidateName:user.Name,
internshipId,
internshipTitle,
companyName,
location,
stipend
});
await newApp.save();
try{
const emailHtml=`<h2>Application Received</h2><p>Dear ${user.Name},</p><p>Your application for <strong>${internshipTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.</p><p>Location: ${location}<br>Stipend: ₹${stipend}/month</p><p>We will notify you once the company reviews your application.</p><p>Best regards,<br>Jobsy Team</p>`;
await sendEmail(candidateEmail,'Application Submitted Successfully',emailHtml);
}catch(emailErr){
console.error('Email send failed:',emailErr);
}
res.status(201).json({message:"Application submitted successfully"});
}catch(err){
console.error("Error applying:",err);
res.status(500).json({error:err.message});
}
}
const getApplicationsByCandidate=async(req,res)=>{
const {email}=req.query;
try{
const apps=await application.find({candidateEmail:email}).sort({appliedDate:-1});
res.status(200).json(apps);
}catch(err){
console.error("Error fetching applications:",err);
res.status(500).json({error:err.message});
}
}
const getApplicationsByCompany=async(req,res)=>{
const {companyName}=req.query;
try{
const apps=await application.find({companyName}).sort({appliedDate:-1});
res.status(200).json(apps);
}catch(err){
console.error("Error fetching applications:",err);
res.status(500).json({error:err.message});
}
}
const saveInternship=async(req,res)=>{
const {candidateEmail,internshipTitle,companyName,location,stipend,skills}=req.body;
try{
const existing=await savedInternship.findOne({candidateEmail,internshipTitle,companyName});
if(existing){
return res.status(400).json({error:"Already saved"});
}
const newSaved=new savedInternship({candidateEmail,internshipTitle,companyName,location,stipend,skills});
await newSaved.save();
res.status(201).json({message:"Internship saved successfully"});
}catch(err){
console.error("Error saving:",err);
res.status(500).json({error:err.message});
}
}
const getSavedInternships=async(req,res)=>{
const {email}=req.query;
try{
const saved=await savedInternship.find({candidateEmail:email}).sort({savedDate:-1});
res.status(200).json(saved);
}catch(err){
console.error("Error fetching saved:",err);
res.status(500).json({error:err.message});
}
}
const removeSavedInternship=async(req,res)=>{
const {candidateEmail,internshipTitle,companyName}=req.body;
try{
await savedInternship.deleteOne({candidateEmail,internshipTitle,companyName});
res.status(200).json({success:true,message:"Removed from saved"});
}catch(err){
console.error("Error removing:",err);
res.status(500).json({error:err.message});
}
}
module.exports={
applyInternship,
getApplicationsByCandidate,
getApplicationsByCompany,
saveInternship,
getSavedInternships,
removeSavedInternship
}
