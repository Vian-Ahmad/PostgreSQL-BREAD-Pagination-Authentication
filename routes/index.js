var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment')
const { isLoggedIn } = require('../helper/split.js');
const { profile } = require('console');


module.exports = function (db) {

  router.get('/', isLoggedIn, async (req, res) => {
    let sql = 'SELECT * FROM todos WHERE usersid = $1'
    const params = []
    const { rows: profil } = await db.query(`SELECT * FROM "users" WHERE id = $1`, [req.session.user.usersid])
    db.query(sql, params, (err, { rows: data }) => {
      if (err) res.send(err)
      else
        res.render('index', { data, moment, profil: profil[0] })
    })
    console.log(params)
    console.log(profil)
  })

  router.get('/add', isLoggedIn, (req, res) => {
    res.render('add', {data: {}})
  })

  router.post('/add', isLoggedIn, (req, res) => {
    const title = req.body.title
    const userId = req.session.user.usersid
    db.query('INSERT INTO todos(title, usersid) VALUES($1, $2)', [title, userId], (err) => {
      if (err) return res.send(err)
      res.redirect('/users')
    })
    console.log(title)
    console.log(userId)
  })


  router.get('/edit', isLoggedIn, (req, res) => {
    res.render('edit')
  })

  router.get('/upload', isLoggedIn, (req, res) => {
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
