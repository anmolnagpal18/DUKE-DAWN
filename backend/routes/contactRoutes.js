const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST a contact submission (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(201).json({ message: 'Contact submitted', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error saving contact', error: error.message });
  }
});

module.exports = router;
