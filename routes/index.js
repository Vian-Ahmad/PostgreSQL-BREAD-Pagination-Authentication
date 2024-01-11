var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment')
const { isLoggedIn } = require('../helper/split.js');



module.exports = function (db) {


  router.get('/', isLoggedIn, async (req, res) => {
    const { page = 1, title, startdate, enddate, complete, operator } = req.query;
    const limit = 5
    const queries = []
    const params = []
    const basketParams = []
    const offset = (page - 1) * limit
    const sortBy = ['title', 'complete', 'deadline'].includes(req.query.sortBy) ? req.query.sortBy : 'id'
    const sortMode = req.query.sortMode === 'asc' ? 'asc' : 'desc'
    const { rows: profil } = await db.query(`SELECT * FROM users WHERE id = $1`, [req.session.user.usersid])
    params.push(req.session.user.usersid)
    basketParams.push(req.session.user.usersid)


    if (title) {
      queries.push(`title ILIKE '%' || $${params.length + 1} || '%'`)
      params.push(title)
      basketParams.push(title)
    }

    if (startdate && enddate) {
      queries.push(`deadline BETWEEN $${params.length + 1} AND $${params.length + 2}::TIMESTAMP + INTERVAL '1 DAY - 1 SECOND'`)
      params.push(startdate, enddate)
      basketParams.push(startdate, enddate)
    } else if (startdate) {
      queries.push(`deadline >= $${params.length + 1}`)
      params.push(startdate)
      basketParams.push(startdate)
    } else if (enddate) {
      queries.push(`deadline <= $${params.length + 1}::TIMESTAMP + INTERVAL '1 DAY - 1 SECOND'`)
      params.push(enddate)
      basketParams.push(enddate)
    }

    if (complete) {
      queries.push(` complete = $${params.length + 1}`)
      params.push(complete)
      basketParams.push(complete)
    }

    let sql = 'SELECT * FROM todos WHERE usersid = $1'
    let sqlcount = `SELECT COUNT (*) as total FROM todos WHERE usersid = $1`

    if (queries.length > 0) {
      sql += ` AND (${queries.join(`${operator}`)})`
      sqlcount += ` AND (${queries.join(`${operator}`)})`
    }

    sql += ` ORDER BY ${sortBy} ${sortMode}`
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)
    db.query(sqlcount, basketParams, (err, data) => {
      if (err) res.send(err)
      const url = req.url == '/' ? `/?page=${page}&$sortBy=${sortBy}&sortMode=${sortMode}` : req.url
      const total = data.rows[0].total
      const pages = Math.ceil(total / limit)
      console.log("ini BACAAAAA", sql)
      console.log('INI YG PARAMS', params)
      db.query(sql, params, (err, { rows: data }) => {
        if (err) return res.send(err)
        res.render('index', { data, query: req.query, moment, url, sortBy, sortMode, pages, page, offset, profil: profil[0] })
      })

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
  })


  router.get('/edit/:id', isLoggedIn, (req, res) => {
    const id = req.params.id

    db.query('SELECT * FROM todos WHERE id = $1', [id], (err, { rows: data }) => {
      if (err) return res.send(err)
      res.render('edit', { data, moment })
    })

  })

  router.post('/edit/:id', isLoggedIn, (req, res) => {
    const id = req.params.id
    const { title, complete, deadline } = req.body
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

  router.get('/upload', isLoggedIn, async (req, res) => {
    const { rows: profil } = await db.query(`SELECT * FROM users WHERE id = $1`, [req.session.user.usersid])
    res.render('upload', { pp: profil[0].avatar })
  })

  router.post('/upload', function (req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.redirect('/users')
    }

    const avatar = req.files.avatar;
    const fileName = `${Date.now()}-${avatar.name}`
    uploadPath = path.join(__dirname, '..', 'public', 'images', fileName)

    avatar.mv(uploadPath, async function (err) {
      if (err)
        return res.status(500).send(err);
      const { rows } = await db.query(`UPDATE users SET avatar = $1 WHERE id = $2`, [fileName, req.session.user.usersid])
      res.redirect('/users');
    });
  });
  return router

}
