var express = require ('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/', (req, res) => {
  res.render('users/login')
})

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.get('/logout', (req, res) => {
  res.render('users/logout')
})

module.exports = router;
