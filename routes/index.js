var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment')
const { isLoggedIn } = require('../helper/split.js');


module.exports = function (db) {

  router.get('/', isLoggedIn, async function (req, res, next) {
    const { page = 1, title, strDate, endDate, Operator, complete } = req.query
    const queries = []
    const params = []
    const paramscount = []
    const limit = 5
    const offset = (page - 1) * 5
    const sortBy = ['title', 'complete', 'deadline'].includes(req.query.sortBy) ? req.query.sortBy : 'id'
    const sortMode = req.query.sortMode === 'asc' ? 'asc' : 'desc';
    const { rows: profil } = await db.query(`SELECT * FROM "users" WHERE id = $1`, [req.session.user.usersid])

    params.push(req.session.user.userid)
    paramscount.push(req.session.user.userid)

    if (title) {
      params.push(title)
      paramscount.push(title)
      queries.push(`title ILIKE '%' || $${params.length} || '%'`);
    }
    if (strDate && endDate) {
      params.push(strDate, endDate);
      paramscount.push(strDate, endDate);
      queries.push(`deadline BETWEEN $${params.length - 1} and $${params.length}::TIMESTAMP + INTERVAL '1 DAY - 1 SECOND'`);
    } else if (strDate) {
      params.push(strDate);
      paramscount.push(strDate);
      queries.push(`deadline >= $${params.length}`);
    } else if (endDate) {
      params.push(endDate);
      paramscount.push(endDate);
      queries.push(`deadline <= $${params.length}::TIMESTAMP + INTERVAL '1 DAY - 1 SECOND'`);
    };
    if (complete) {
      params.push(complete)
      paramscount.push(complete)
      queries.push(`complete = $${params.length}`);
    }
    let sqlcount = 'SELECT COUNT (*) AS total FROM todos WHERE usersid = $1';
    let sql = `SELECT * FROM todos WHERE usersid = $1`;
    if (queries.length > 0) {
      sql += ` AND (${queries.join(` ${Operator} `)})`
      sqlcount += ` AND (${queries.join(` ${Operator} `)})`
    }

    sql += ` ORDER BY ${sortBy} ${sortMode}`

    params.push(limit, offset)
    sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
    db.query(sqlcount, paramscount, (err, data) => {
      if (err) res.send(err)
      else {
        const url = req.url == '/' ? `/?page=${page}&sortBy=${sortBy}&sortMode=${sortMode}` : req.url
        const total = data.rows[0].total;
        const pages = Math.ceil(total / limit);
        db.query(sql, params, (err, { rows: data }) => {
          if (err) res.send(err)
          else
            res.render('user/list', { data, query: req.query, moment, pages, offset, page, url, sortMode, sortBy, profil: profil[0] })
        })
      }
    })
  });

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
