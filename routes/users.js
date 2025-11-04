const express = require('express');
const router = express.Router();
const db = require("../models/db").db;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user_register');
});

router.post('/', async function(req, res, next) {
  res.json(await db.dbInsert(req.body));
});


module.exports = router;
