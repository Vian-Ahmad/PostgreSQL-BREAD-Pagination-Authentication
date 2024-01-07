var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment')
const { isLoggedIn } = require('../helper/split.js');



module.exports = function (db) {


  router.get('/', isLoggedIn, async (req, res) => {
    const { page = 1, title, startdate, enddate, complete, type_search, sort } = req.query;
    const limit = 5
    const offset = (page - 1) * limit
    let sql = 'SELECT * FROM todos WHERE usersid = $1'
    const params = []
    const { rows: profil } = await db.query(`SELECT * FROM "users" WHERE id = $1`, [req.session.user.usersid])
    params.push(req.session.user.usersid)
    db.query(sql, params, (err, { rows: data }) => {
      if (err) res.send(err)
      else
        res.render('index', { data, moment, offset, profil: profil[0] })
    })
  })

  router.get('/add', isLoggedIn, (req, res) => {
    res.render('add', { data: {} })
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


  router.get('/edit/:id', isLoggedIn, (req, res) => {
    const id = req.params.id
    
    db.query('SELECT * FROM todos WHERE id = $1', [id], (err, { rows: data }) => {
      if (err) return res.send(err)
      console.log(new Date(data[0].deadline), 'ini datanya')
      res.render('edit', { data, moment })
    })

  })

  router.post('/edit/:id', isLoggedIn, (req, res) => {
    const id = req.params.id
    const { title, complete, deadline } = req.body
    console.log("ini deadline post:", deadline )
    db.query(`UPDATE todos SET title = $1, complete = $2, deadline = $3 WHERE id = $4`, [title, Boolean(complete), deadline, id], (err) => {
      if (err) return res.send(err) 
      res.redirect('/users')
    })
  })

  router.get('/delete/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;
    db.query(`DELETE FROM todos WHERE id = $1`, [id], (err) => {
      if (err) res.send(err)
      else res.redirect('/users')
    })
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
