const router = require('express').Router()
const { Category, Product } = require('../../models')

// The `/api/categories` endpoint

// get all categories
router.get('/', async (req, res) => {
  try {
    // find all categories
    // be sure to include its associated Products
    const dbReturnData = await Category.findAll({
      attributes: ['id', 'category_name'],
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }]
    })

    // Check if data exists, if not return status 404
    if (!dbReturnData) {
      return res.status(404).json({ message: 'No categories were found' })
    }
    // If data exists, return status 200 and json of data
    res.status(200).json(dbReturnData)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred getting all categories.', error: err.toString() })
  }
})

// get single category by id
router.get('/:id', async (req, res) => {
  try {
    // find one category by its `id` value
    // be sure to include its associated Products
    const dbReturnData = await Category.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'category_name'],
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }]
    })

    // Check if the category exists
    if (!dbReturnData) {
      return res.status(404).json({ message: `No category found with this id: ${req.params.id}` })
    }

    res.status(200).json(dbReturnData)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred retrieving a category.', error: err.toString() })
  }
})

router.post('/', async (req, res) => {
  // create a new category
  try {
    const dbReturnData = await Category.create({
      category_name: req.body.category_name
    },
    // ensure any hooks are run on all the data being updated
    {
      individualHooks: true
    }
    )
    if (!dbReturnData) {
      return res.status(500).json({ message: 'An error occurred creating a category.' })
    }
    // If data exists, return status 200 and json of data
    res.status(200).json(dbReturnData)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred creating a category.', error: err.toString() })
  }
})

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const dbReturnData = await Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id
        },
        // ensure any hooks are run on all the data being updated
        individualHooks: true
      }
    )
    // The `update` method returns the number of rows affected, not the data itself
    // If no rows are affected, it means the category was not found
    if (!dbReturnData || dbReturnData[0] === 0) {
      return res.status(404).json({ message: `No category found with this id: ${req.params.id}` })
    }
    res.status(200).json({ message: 'Category updated successfully.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred', error: err.toString() })
  }
})

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const dbReturnData = await Category.destroy({
      where: {
        id: req.params.id
      }
    })

    // Check if any row was affected (`destroy` method returns the number of deleted rows)
    if (dbReturnData === 0) {
      return res.status(404).json({ message: `No category found with this id: ${req.params.id}` })
    }

    res.status(200).json({ message: 'Category deleted successfully.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred', error: err.toString() })
  }
})

module.exports = router
