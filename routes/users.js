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
      const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      if (rows.length == 0) {
        new Error(`email doesn't exist`)
        res.redirect('/')
      };
      const storedPass = rows[0].password
      const passwordMatch = bcrypt.compareSync(password, storedPass)
      if (!passwordMatch) {
        new Error(`password wrong`)
        res.redirect('/')
      };
      req.session.user = storedPass

      res.redirect('/users')

    } catch (error) {
      

    }
  })

  router.get('/register', (req, res) => {

    res.render('users/register')
  })

  router.post('/register', async (req, res) => {
    const { email, password, repassword } = req.body
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
    req.session.destroy(function(err) {
      res.redirect('users/logout')
    })
    
  })

  return router 

}
