const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
app.use(express.json());
// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());
// MySQL database configuration
const db = mysql.createConnection({  
    host: 'localhost',
    user: 'root',
    password: 'Rahul@6143',
    database: 'image_upload_db',
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});



// Set Storage Engine for Multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Upload Endpoint
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ message: 'No File Selected!' });
            } else {
                const file = req.file;
                const filename = file.filename;
                const filepath = file.path;

                const sql = 'INSERT INTO images (filename, filepath) VALUES (?, ?)';
                db.query(sql, [filename, filepath], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).json({ message: 'File Uploaded!', file: file });
                });
            }
        }
    });
});

// Serve Static Files
app.use('/uploads', express.static('uploads'));




// const transporter = nodemailer.createTransport({
//   host: 'smtp.elasticemail.com',
//   port: 2525,
//   auth: {
//       user: 'er.rahulyadav9690@gmail.com',
//       pass: 'D6A492C30A1AE5ED8DAA47A6CA8CAC50232E'
//   }
// });

// app.post('/api/data', (req, res) => {
//   const { Name, Email, Phone, Message } = req.body;

//   if (!Name || !Email || !Phone || !Message) {
//       return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Check if the same email or phone already exist in the database
//   const checkExistingQuery = 'SELECT COUNT(*) AS count FROM otp.portfoliodatatable WHERE Email = ? OR Phone = ?';
//   const checkExistingValues = [Email, Phone];

//   db.query(checkExistingQuery, checkExistingValues, (err, result) => {
//       if (err) {
//           console.error('Error checking existing records:', err);
//           return res.status(500).json({ error: 'Error checking existing records' });
//       }

//       const { count } = result[0];

//       if (count > 0) {
//           return res.status(400).json({ error: 'Record with same email or phone already exists' });
//       }

//       // If no existing records with same email or phone, proceed to insert new data
//       const insertQuery = 'INSERT INTO otp.portfoliodatatable (Name, Email, Phone, Message) VALUES (?, ?, ?, ?)';
//       const insertValues = [Name, Email, Phone, Message];

//       db.query(insertQuery, insertValues, (err, result) => {
//           if (err) {
//               console.error('Error inserting data:', err);
//               return res.status(500).json({ error: 'Error inserting data' });
//           }
          
//           console.log('Data inserted successfully');
//           const mailOptions = {
//               from: 'er.rahulyadav9690@gmail.com',
//               to: 'er.rahulyadav9690@gmail.com', // Destination email address
//               subject: 'New Form Submission',
//               text: `Name: ${Name}\nEmail: ${Email}\nPhone: ${Phone}\nMessage: ${Message}`
//           };

//           transporter.sendMail(mailOptions, (error, info) => {
//               if (error) {
//                   console.error('Error sending email:', error);
//                   return res.status(500).json({ error: 'Error sending email' });
//               }
//               console.log('Email sent:', info.response);
//               res.status(200).json({ message: 'Data inserted successfully and email sent' });
//           });
//       });
//   });
// });



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
