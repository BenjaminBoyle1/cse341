const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// helper to validate ObjectId
const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

const getAll = async (req, res) => {
  try {
    const docs = await mongodb.getDb().db().collection('contacts').find().toArray();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch contacts', error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Invalid contact id' });

    const doc = await mongodb.getDb().db().collection('contacts').findOne({ _id });
    if (!doc) return res.status(404).json({ message: 'Contact not found' });

    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch contact', error: err.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const result = await mongodb.getDb().db().collection('contacts').insertOne(contact);

    // 201 with ID of new contact
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create contact', error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Invalid contact id' });

    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const result = await mongodb
      .getDb()
      .db()
      .collection('contacts')
      .updateOne({ _id }, { $set: contact });

    if (result.matchedCount === 0) return res.status(404).json({ message: 'Contact not found' });

    // 204 No Content
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to update contact', error: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Invalid contact id' });

    const result = await mongodb.getDb().db().collection('contacts').deleteOne({ _id });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'Contact not found' });

    // 200 OK
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete contact', error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
