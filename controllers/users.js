const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all contacts
const getAll = async (req, res) => {
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find();

    const contacts = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving contacts', error: error.message });
  }
};

// GET single contact
const getSingle = async (req, res) => {
  // #swagger.tags=['Contacts']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const contactId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find({ _id: contactId });

    const contact = (await result.toArray())[0];

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving contact', error: error.message });
  }
};

// CREATE contact
const createContact = async (req, res) => {
  // #swagger.tags=['Contacts']
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    // Basic validation
    if (!contact.firstName || !contact.lastName || !contact.email) {
      return res.status(400).json({ message: 'firstName, lastName, and email are required' });
    }

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({
        message: 'Contact created successfully',
        id: response.insertedId
      });
    } else {
      res.status(500).json({ message: 'Contact could not be created' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating contact', error: error.message });
  }
};

// UPDATE contact
const updateContact = async (req, res) => {
  // #swagger.tags=['Contacts']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const contactId = new ObjectId(req.params.id);

    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .replaceOne({ _id: contactId }, contact);

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(200).json({ message: 'Contact found but no changes were made' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contact', error: error.message });
  }
};

// DELETE contact
const deleteContact = async (req, res) => {
  // #swagger.tags=['Contacts']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact ID format' });
    }

    const contactId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};