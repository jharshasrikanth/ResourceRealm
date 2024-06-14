const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, uniqueSuffix + '.' + fileExtension);
  }
});

const upload = multer({ storage: storage });

// Connect to the MongoDB database
mongoose.connect('mongodb+srv://naveenede:Naveen4@cluster0.ttnijab.mongodb.net/resourcerealm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Define a schema for your documents
const materialSchema = new mongoose.Schema({
  file_data: Buffer,
  title: String,
  subject: String,
  file_type: String,
});

// Create a model for the schema
const Material = mongoose.model('Material', materialSchema);

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle the file upload
app.post('/upload', upload.single('pdf_file'), async (req, res) => {
  try {
    const pdfData = fs.readFileSync(req.file.path);
    const title = req.body.title;
    const subject = req.body.subject;
    const fileType = req.file.mimetype;

    // Create a new Material document and save it to the MongoDB
    const material = new Material({
      file_data: pdfData,
      title: title,
      subject: subject,
      file_type: fileType,
    });

    await material.save();

    console.log('File inserted successfully');
    
    // Get all files under the same subject
    const files = await Material.find({ subject: subject });

    // Send the response HTML with the uploaded files under the subject
    let responseHtml = `
      <h3>File uploaded and stored in the database</h3>
      <h4>Files under the subject '${subject}'</h4>
    `;

    if (files.length > 0) {
      const fileList = files.map(file => `
        <li>
          ${file.title} - 
          <a href="/display/${file._id}">View</a> |
          <a href="/download/${file._id}">Download</a>
        </li>
      `).join('');
      responseHtml += `<ul>${fileList}</ul>`;
    } else {
      responseHtml += `<p>No files found under the subject '${subject}'</p>`;
    }

    res.send(responseHtml);
  } catch (err) {
    console.error('Error uploading and storing file:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Handle the search form submission and file retrieval
app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;

  try {
    // Perform the search query
    const keywordPattern = new RegExp(keyword, 'i');
    const results = await Material.find({ $or: [{ title: keywordPattern }, { subject: keywordPattern }] });

    if (results.length > 0) {
      // Files found in the database
      let responseHtml = `
        <h3>Files Found</h3>
        <ul>
      `;
      results.forEach((file) => {
        responseHtml += `
          <li>
            ${file.title} - 
            <a href="/display/${file._id}">View</a> |
            <a href="/download/${file._id}">Download</a>
          </li>
        `;
      });
      responseHtml += '</ul>';
      res.send(responseHtml);
    } else {
      // No files found in the database
      res.send('<p>No files found</p>');
    }
  } catch (err) {
    console.error('Error searching for files:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new connection for file downloading
app.get('/download/:id', async (req, res) => {
  const fileId = req.params.id;

  try {
    // Retrieve the file from MongoDB by ID
    const file = await Material.findById(fileId);

    if (file) {
      // File found in the database
      const fileData = file.file_data;
      const fileName = file.title;
      const fileType = file.file_type;

      // Set the response headers for file download
      res.setHeader('Content-Type', fileType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      // Send the file data as the response
      res.send(fileData);
    } else {
      // File not found in the database
      res.status(404).send('File not found');
    }
  } catch (err) {
    console.error('Error retrieving file by ID:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new connection for file display
app.get('/display/:id', async (req, res) => {
  const fileId = req.params.id;

  try {
    // Retrieve the file from MongoDB by ID
    const file = await Material.findById(fileId);

    if (file) {
      // File found in the database
      const fileData = file.file_data;
      const fileName = file.title;
      const fileType = file.file_type;

      // Set the response headers for file display
      res.setHeader('Content-Type', fileType);
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      // Send the file data as the response
      res.send(fileData);
    } else {
      // File not found in the database
      res.status(404).send('File not found');
    }
  } catch (err) {
    console.error('Error retrieving file by ID:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
