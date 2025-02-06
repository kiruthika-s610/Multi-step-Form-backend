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
    

// const userSchema = new mongoose.Schema({
//     image:String
// })

// const usermodel = mongoose.model("user", userSchema)

// const storage = multer.diskStorage({
//     destination:(req, file, cb)=>{
//         cb(null, './public/images')
//     },
//     filename:(req,file, cb)=>{
//         cb(null, file.fieldname + '_ ' + Date.now()+path.extname(file.originalname))
//     }
// })

// const upload = multer ({
//        storage:storage
// })

// app.post('/upload', upload.single('file'), (req,res)=>{
    
// usermodel.create({image : req.file.filename}).then(result=>res.json(result)).catch((err)=>console.log(err))
// })

// app.get('/getimage', (req,res)=>{
//     usermodel.find().then(user=>res.json(user)).catch(err=>res.json(err))
// })





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

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|pdf/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
  
//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only jpg, png, and pdf files are allowed!'));
//     }
//   };

const upload = multer({ storage });   
// const upload = multer({
//     storage: storage,
                   // limits: { fileSize: 2 * 1024 * 1024 },
                   // fileFilter: (req, file, cb) => {
                   //   if (file.fieldname === "photo") {
                   //     if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
                   //         return cb(new Error("Only JPG and PNG images are allowed for the photo field."));
                   //       }
                   //     } else if (file.fieldname === "resume") {
                   //       // Allow only PDF for resume
                   //       if (file.mimetype !== "application/pdf") {
                   //         return cb(new Error("Only PDF files are allowed for the resume field."));
                   //       }
                   //     }
                   //     cb(null, true);
                   //   },
    // });



app.post('/submit-form', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 },    
]), async (req,res)=>{
try{
    if (!req.files['photo'] || !req.files['resume']) {
        return res.status(400).send({ error: 'Photo or resume file is missing' });
      }

      // const photoFile = req.files.photo[0];
      // const resumeFile = req.files.resume[0];

                              // Check file size limits
                              // if (photoFile.size > 5 * 1024 * 1024) {
                              //   return res.status(400).send({ error: "Photo size exceeds 5 MB limit." });
                              // }
                              // if (resumeFile.size > 15 * 1024 * 1024) {
                              //   return res.status(400).send({ error: "Resume size exceeds 15 MB limit." });
                              // }

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

app.listen(3000, ()=>{
    console.log("server is listening to the port 3000")
})