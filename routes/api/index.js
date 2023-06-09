// Initiate the router
const router = require('express').Router()

// Import all of the API routes from /api/index.js
const categoryRoutes = require('./category-routes')
const productRoutes = require('./product-routes')
const tagRoutes = require('./tag-routes')

// Adds prefix of `/api` to all of the api routes imported from the `api` directory
router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/tags', tagRoutes)

module.exports = router
