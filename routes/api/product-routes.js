const router = require('express').Router()
const { Product, Category, Tag, ProductTag } = require('../../models')

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const dbReturnData = await Product.findAll({
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [{
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
      ]
    })

    // Check if data exists, if not return status 404
    if (!dbReturnData) {
      return res.status(404).json({ message: 'No products found' })
    }
    // If data exists, return status 200 and json of data
    res.status(200).json(dbReturnData)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred', error: err.toString() })
  }
})

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const dbReturnData = await Product.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      include: [{
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
      ]
    })

    // Check if data exists, if not return status 404
    if (!dbReturnData) {
      return res.status(404).json({ message: 'No product found.' })
    }
    // If data exists, return status 200 and json of data
    res.status(200).json(dbReturnData)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred retrieving a product.', error: err.toString() })
  }
})

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(
      req.body,
      // ensure any hooks are run on all the data being updated
      {
        individualHooks: true
      }
    )

    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id, tag_id
        }
      })
      console.log('Product TagID Array: ' + productTagIdArr)
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr)
      return res.status(200).json(productTagIds)
    }

    // if no product tags, just respond
    res.status(200).json(product)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'An error occurred', error: err.toString() })
  }
})

// update product
router.put('/:id', async (req, res) => {
  try {
    // update product data
    const product = await Product.update(req.body, {
      where: {
        id: req.params.id
      },
      // ensure any hooks are run on all the data being updated
      individualHooks: true
    })

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id }
      })

      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id)
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id
          }
        })
      console.log('New Product TagID Array: ' + newProductTags)
      
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id)

      // run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags)
      ])
    }

    res.status(200).json(product)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'An error occurred', error: err.toString() })
  }
})

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    // delete one product by its `id` value
    const dbReturnData = await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    // Check if any row was affected (`destroy` method returns the number of deleted rows)
    if (dbReturnData === 0) {
      return res.status(404).json({ message: 'No product found with this id' })
    }
    res.status(200).json({ message: 'Product deleted successfully.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred', error: err.toString() })
  }
})

module.exports = router
