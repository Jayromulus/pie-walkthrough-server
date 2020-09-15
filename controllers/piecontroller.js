// const express = require('express')
// const router = express.Router()
const router = require('express').Router();
// we use the express.Router class to create modular, mountable route handlers. we will import this router into the app.js file so we can access these routes anywhere
const Pie = require('../db').import('../models/pie');
let validateSession = require('../middleware/validate-session')

// router.get('/', (req, res) => res.send('I love pie!'));
// we can use '/' so that we don't have to add any subrouting to this pies endpoint

router.get('/', (req, res) => {
  Pie.findAll()
    .then(pie => res.status(200).json(pie))
    .catch(err => res.status(500).json({
      error: err
    }))
})

router.post('/', validateSession, (req, res) => {
  const pieFromRequest = {
    nameOfPie: req.body.name,
    baseOfPie: req.body.base,
    crust: req.body.crust,
    timeToBake: req.body.time,
    servings: req.body.serve,
    rating: req.body.rate
  }

  Pie.create(pieFromRequest)
    .then(pie => res.status(200).json(pie))
    .catch(err => res.json(req.errors))
})

/*
CHALLENGE ENDPOINTS ARE HERE
*/

// localhost:3000/pies/Pecan Pie
router.get('/:name', (req, res) => {
  Pie.findOne({ where: { nameOfPie: req.params.name }})
    .then(pie => res.status(200).json(pie))
    .catch(err => res.status(500).json({ error: err}))
})

// localhost:3000/pies/2
router.put('/:id', validateSession, (req, res) => {
  Pie.update(req.body, { where: { id: req.params.id }})
    .then(pie => res.status(200).json(pie))
    .catch(err => res.json(req.errors))
})

//    localhost:3000/3/Pecan%20Pie
// router.delete('/:id/:name', function(req, res){
router.delete('/:id', validateSession, function(req, res){
  Pie.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(pie => res.status(200).json(pie))
  .catch(err => res.json({error: err}))
})

/*

C - create
R - read   - get
U - update - put
D - delete

*/


module.exports = router;