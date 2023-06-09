// This file is the entry point for all routes.
// It will import all of the API routes from the api directory
// and package them up. It also includes a catch-all route that
// returns a user-friendly message when the client makes a
// request to any endpoint that doesn't exist.
const router = require('express').Router()
const apiRoutes = require('./api')

router.use('/api', apiRoutes)

router.use((req, res) => {
  res.send('<h1>Wrong Route!</h1>')
})

module.exports = router
