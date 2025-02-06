const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer =require('multer')
const path=require('path')
const bodyparser=require('body-parser')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('./public'))
app.use(bodyparser.json())


mongoose.connect('mongodb+srv://kiruthikas610:sriadvikS64113@cluster0.bthdi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
    
const formSchema = new mongoose.Schema({
    name: String,
    location: String,
    city: String,
    citizenship: String,
    EnglishProficiency: String,
    reason: String,
    yearsexp: String,
    jobinterest: String,
    yearsexp_skills: String,
    certificate: String,
    skills: [String],
    jobtype: String,
    rate_dollar: String,
    linkedin: String,
    Github:String,
    photo: {
        data:Buffer,
        contentType: String,
        filename:String
    },
    resume: {
        data:Buffer,
        contentType: String,
        filename:String
    },
})

const formModel = mongoose.model('FormData', formSchema)

const storage = multer.memoryStorage();

const upload = multer({ storage });   

app.post('/submit-form', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 },    
]), async (req,res)=>{
try{
    if (!req.files['photo'] || !req.files['resume']) {
        return res.status(400).send({ error: 'Photo or resume file is missing' });
      }     

    const newForm = new formModel({
    name: req.body.name,
    location: req.body.location,
    city: req.body.city,
    citizenship: req.body.citizenship,
    EnglishProficiency: req.body.EnglishProficiency,
    reason: req.body.reason,
    yearsexp: req.body.yearsexp,
    jobinterest: req.body.jobinterest,
    yearsexp_skills: req.body.yearsexp_skills,
    certificate: req.body.certificate,
    skills: req.body.skills,
    jobtype: req.body.jobtype,
    rate_dollar: req.body.rate_dollar,
    linkedin: req.body.linkedin,
    Github:req.body.Github,
    photo:req.files['photo'] ? {
        data: req.files['photo'][0].buffer,
        contentType: req.files['photo'][0].mimetype,
        filename: req.files['photo'][0].originalname,
    } : null,
    resume: req.files['resume'] ? {
        data: req.files['resume'][0].buffer,
        contentType: req.files['resume'][0].mimetype,
        filename: req.files['resume'][0].originalname,
    } : null,
    });
    await newForm.save();
    console.log(req.files)
    res.status(201).send({ message: 'Form submitted successfully' });
} catch(err) {
    console.log(err)
    console.log(req.files)
    res.status(500).send({ error: 'Failed to submit form' });
}
});

app.get('/form-data',async (req,res)=>{
    try{
        const forms = await formModel.find({});
        const formsWithBase64 = forms.map(form => ({
          ...form._doc,
          photo: `data:${form.photo.contentType};base64,${form.photo.data.toString('base64')}`,
          resume: `data:${form.resume.contentType};base64,${form.resume.data.toString('base64')}`
        }));
        res.status(200).json(formsWithBase64);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to retrieve form data' });
      }
    });

    



// app.listen(3000, ()=>{
//     console.log("server is listening to the port 3000")
// })