const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all users
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('users').find();
    const users = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// GET single user
const getSingle = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('users')
      .find({ _id: userId });

    const users = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

// CREATE user
const createUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('users')
      .insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({ message: 'User created', id: response.insertedId });
    } else {
      res.status(500).json({ message: 'User could not be created' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('users')
      .replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  //#swagger.tags=['Users']
  try {
    const userId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDatabase()
      .db()
      .collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};