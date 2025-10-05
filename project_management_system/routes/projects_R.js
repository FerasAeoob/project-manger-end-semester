const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let projects = [];
let nextID = 1;


if (!fs.existsSync('images')) {
  fs.mkdirSync('images');
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    let id = req.params.id ? req.params.id : nextID;
    let finalFilename = `${id}${path.extname(file.originalname)}`;
    cb(null, finalFilename);
  }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {

  res.json(projects.filter(p => p));
});

router.post('/', upload.single('image'), (req, res) => {
  let id = nextID++;
  let projectTitle = req.body.projectTitle || '';
  let clientName = req.body.clientName || '';
  let notes = req.body.notes || '';
  let imageFile = req.file ? req.file.filename : null;
  let project = { id, projectTitle, clientName, notes, imageFile };
  projects[id] = project;
  res.json({ message: 'ok', project });
});

router.get('/:id', (req, res) => {
  let id = Number(req.params.id);
  if (isNaN(id)) return res.json({ message: 'invalid id' });
  let project = projects[id];
  if (!project) return res.json({ message: 'not found' });
  res.json(project);
});

router.patch('/:id', upload.single('image'), (req, res) => {
  let id = Number(req.params.id);
  if (isNaN(id)) return res.json({ message: 'invalid id' });
  let project = projects[id];
  if (!project) return res.json({ message: 'not found' });


  let oldImage = project.imageFile;
  let newImage = req.file ? req.file.filename : null;
  if (oldImage && newImage && newImage !== oldImage) {
    if (fs.existsSync(path.join('images', oldImage))) {
      fs.unlinkSync(path.join('images', oldImage));
    }
    project.imageFile = newImage;
  }

  if (req.body.projectTitle) project.projectTitle = req.body.projectTitle;
  if (req.body.clientName) project.clientName = req.body.clientName;
  if (req.body.notes) project.notes = req.body.notes;

  res.json({ message: 'ok', project });
});



router.delete('/:id', (req, res) => {
  let id = Number(req.params.id);
  if (isNaN(id)) return res.json({ message: 'invalid id' });
  let project = projects[id];
  if (!project) return res.json({ message: 'not found' });

  if (project.imageFile) {
    if (fs.existsSync(path.join('images', project.imageFile))) {
      fs.unlinkSync(path.join('images', project.imageFile));
    }
  }

  projects[id] = null;
  res.json({ message: 'ok' });
});

module.exports = router;
