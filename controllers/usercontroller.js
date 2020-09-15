const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
  User.create({
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  .then(
    createSuccess = (user) => {                                          // 60*60*24
      let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'})
      res.json({
        user: user,
        message: 'user created',
        sessionToken: token
      })
    },
    createError = err => res.status(500).json(err)
  )
})

router.post('/signin', (req, res) => {
  // 1- find matching email in database
  // 2- check if passwords match
  // 3- return a token

  // 1
  User.findOne({ where: { email: req.body.email } })
  .then(
    user => {
      if(user){ // if we successfully find a user with an email that matches
        // 2
        bcrypt.compare(req.body.password, user.password, (err, matches) => {
          if(matches){
            // 3
            let token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {expiresIn: '1d'})
            res.status(200).json({
              user: user,
              message: 'successfully authenticated user',
              sessionToken: token
            })
          } else {
            res.status(502).send({ error: 'bad gateway' })
          }
        })
      } else {
        res.status(500).send({ error: 'failed to authenticate' })
      }
    },
    err => res.status(501).send({ error: 'failed to process' })
  )
})

module.exports = router;