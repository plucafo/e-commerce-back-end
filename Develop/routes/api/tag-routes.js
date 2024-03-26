const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: {
        model: Product,
        through: ProductTag, // Include the ProductTag model for the association
        attributes: ['id', 'product_name', 'price', 'stock'], // Specify the attributes you want to include from Product
      },
    });

    // If tags are found, send them as a response
    res.json(tags);
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: {
        model: Product,
        through: ProductTag,
        attributes: ['id', 'product_name', 'price', 'stock'],
      },
    });

    if (!tagData) {
      // If tag with the specified ID is not found, send a 404 response
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Send the tag data along with associated products as a response
    res.json(tagData);
  } catch (err) {
    console.error('Error fetching tag by ID:', err);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    // Create a new tag using the data from the request body
    const newTag = await Tag.create(req.body);

    // If the new tag is created successfully, send it as a response
    res.status(201).json(newTag);
  } catch (err) {
    console.error('Error creating tag:', err);
    res.status(400).json({ error: 'Failed to create tag' });
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Update the tag's name with the new name from the request body
    await tag.update({ tag_name: req.body.tag_name });

    // Send the updated tag as a response
    res.json(tag);
  } catch (err) {
    console.error('Error updating tag:', err);
    res.status(400).json({ error: 'Failed to update tag' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Delete the tag
    await tag.destroy();

    // Send a success message as a response
    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error('Error deleting tag:', err);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

module.exports = router;
