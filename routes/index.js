var express = require('express');
var router = express.Router();
var path = require('path');


module.exports = function (db) {
  router.get('/', (req, res) => {
    res.render('index')
  })

  router.get('/add', (req, res) => {
    res.render('add')
  })

  router.get('/edit', (req, res) => {
    res.render('edit')
  })

  router.get('/upload', (req, res) => {
    res.render('upload')
  })

  // router.post('/upload', function (req, res) {
  //   let sampleFile;
  //   let uploadPath;

  //   if (!req.files || Object.keys(req.files).length === 0) {
  //     return res.status(400).send('No files were uploaded.');
  //   }

  //   sampleFile = req.files.avatar;
  //   uploadPath = path.join(__dirname, '..', 'public', 'images', sampleFile.name)
  //   // console.log(uploadPath)

  //   sampleFile.mv(uploadPath, function (err) {
  //     if (err)
  //       return res.status(500).send(err);

  //     res.send('File uploaded!');
  //   });
  // });
  return router

}
