const router = require('express').Router()
const { Tag, Product, ProductTag } = require('../../models')

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const dbReturnData = await Tag.findAll({
      attributes: ['id', 'tag_name'],
      include: [{
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }]
    })

    // Check if data exists, if not return status 404
    if (!dbReturnData) {
      return res.status(404).json({ message: 'No tags found' })
    }

    res.status(200).json(dbReturnData)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred retrieving all tags.', error: err.toString() })
  }
})

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const dbReturnData = await Tag.create({
      tag_name: req.body.tag_name
    },
    // ensure any hooks are run on all the data being updated
    {
      individualHooks: true
    }
    )
    if (!dbReturnData) {
      return res.status(500).json({ message: 'An error occurred creating a tag.' })
    }
    // If data exists, return status 200 and json of data
    res.status(200).json(dbReturnData)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred creating a tag.', error: err.toString() })
  }
})

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const dbReturnData = await Tag.update(req.body,
      {
        where: {
          id: req.params.id
        },
        // ensure any hooks are run on all the data being updated
        individualHooks: true
      }
    )
    // The `update` method returns the number of rows affected, not the data itself
    // If no rows are affected, it means the tag was not found
    if (!dbReturnData || dbReturnData[0] === 0) {
      return res.status(404).json({ message: `No tag found with this id: ${req.params.id}` })
    }
    res.status(200).json({ message: 'Tag updated successfully.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred updating a tag', error: err.toString() })
  }
})

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const dbReturnData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })

    // Check if any row was affected (`destroy` method returns the number of deleted rows)
    if (dbReturnData === 0) {
      return res.status(404).json({ message: `No tag found with this id: ${req.params.id}` })
    }

    res.status(200).json({ message: 'Tag deleted successfully.' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'An error occurred deleting a tag.', error: err.toString() })
  }
})
module.exports = router
