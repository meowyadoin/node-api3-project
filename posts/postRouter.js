const express = require('express');
const database = require('./postDb')
const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  database.get()
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json({
        message: 'Server side error'
      })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  database.getById(req.params.id)
    .then(data => {
      res.status(201).json(data)
    })
    .catch(err => {
      res.status(500).json({ message: '500 error' })
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  database.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'delete successful' })
    })
    .catch(err => {
      res.status(500).json({ message: '500 error' })
    })

});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  database.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json({ message: 'update successful' })
    })
    .catch(err => {
      res.status(500).json({ message: '500 error' })
    })
});

// custom middleware

function validatePostId(req, res, next) {
  database.getById(req.params.id)
    .then(data => {

      console.log(data.id)
      req.user = data
      next()



    })
    .catch(err => {
      res.status(400).json({ message: "invalid user id" })
    })
}

module.exports = router;