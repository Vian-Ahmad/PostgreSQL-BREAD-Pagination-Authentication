var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = function (db) {

  router.get('/', (req, res) => {
    res.render('users/login')
  })

  router.post('/', async (req, res) => {


    try {
      const { email, password } = req.body
      console.log(req.body, 'WOY WOY WOY')
      const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      console.log(rows)
      const passwordMatch = bcrypt.compareSync(password, rows[0].password)
      console.log('password :', password)
      if (rows.length == 0) {
        new Error(`email doesn't exist`)
        res.redirect('/')
      };
      if (!passwordMatch) {
        new Error(`password wrong`)
        res.redirect('/')
      };
      res.redirect('/users')

    } catch (error) {
      console.log(error, 'salah woy')

    }
  })



  router.get('/register', (req, res) => {
    console.log('NIHH JAWABANNYA 2')

    res.render('users/register')
  })

  router.post('/register', async (req, res) => {
    const { email, password, repassword } = req.body
    console.log(req.body, 'NIHH JAWABANNYA')
    try {
      if (password !== repassword) throw new Error(`password doesn't match`)
      const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      console.log(rows)
      if (rows.length > 0) throw new Error(`email already exist`)
      const hash = bcrypt.hashSync(password, saltRounds);
      const { rows: users } = await db.query('INSERT INTO users(email, password) VALUES ($1, $2) returning *', [email, hash])
      res.redirect('/')
    } catch (error) {
      res.send(error.message)
    }


  })

  router.get('/logout', (req, res) => {
    res.render('users/logout')
  })

  return router

}
