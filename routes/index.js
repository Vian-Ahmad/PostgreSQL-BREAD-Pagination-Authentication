var express = require ('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', (req, res) => {
  res.render('users/login')
})

router.get('/upload', (req, res) => {
  res.render('upload')
})

router.get('/index', (req, res) => {
  res.render('index')
})

router.get('/add', (req, res) => {
  res.render('add')
})

router.get('/edit', (req, res) => {
  res.render('edit')
})


module.exports = router;
