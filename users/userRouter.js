const express = require('express');
const database = require('./userDb')
const postdatabase = require('../posts/postDb')
const router = express.Router();

router.post('/', (req, res) => {
  database.insert(req.body)
    .then(() => {
      res.status(200).json({ message: 'user creation: successful' })
    })
    .catch(err => {
      res.status(500).json({ message: '500 error' })
    })
});

router.post('/:id/posts', validateUser, validatePost, (req, res) => {
  const { text } = req.body

  const user_id = req.params.id
  postdatabase.insert({ text, user_id })
    .then(data => {
      console.log(data.id)

      res.status(201).json(data)

    })

    .catch(error => {
      console.log(error)
      res.status(500).json({
        errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
      })
    })
});

router.get('/', (req, res) => {
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

router.get('/:id', validateUserId, (req, res) => {
  database.getById(req.params.id)
    .then(data => {
      res.status(201).json(data)
    })
    .catch(err => {
      res.status(500).json({ message: '500 error' })
    })
});

router.get('/:id/posts', (req, res) => {
  database.getUserPosts(req.params.id)
    .then(comments => {
      if (comments[0]) {
        res.status(200).json(comments)
      } else {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist."
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        errorMessage: 'Error 500: This is a server side error. If this error persists contact your server admin. '
      })
    })
});

router.delete('/:id', validateUser, (req, res) => {
  database.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'delete: successful' })
    })
    .catch(err => {
      res.status(500).json({ message: '500 error' })
    })
});

router.put('/:id', validateUser, (req, res) => {
  database.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json({ message: 'update: successful' })
    })
    .catch(err => {
      res.status(500).json({ message: '500 error' })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
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

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body.name) {
    res.status(400).json({ message: 'nissing user data' })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' })
  } else {
    next()
  }
}

module.exports = router;