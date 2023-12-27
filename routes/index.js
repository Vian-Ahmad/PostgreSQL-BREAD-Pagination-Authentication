var express = require ('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/upload', (req, res) => {
  res.render('upload')
})

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/add', (req, res) => {
  res.render('add')
})

router.get('/edit', (req, res) => {
  res.render('edit')
})


module.exports = router;
