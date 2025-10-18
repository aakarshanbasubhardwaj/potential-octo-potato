import mongoose from 'mongoose';

/**
 * Retrieve all documents from a model
 * model - Mongoose model
 * filter - Optional query filter
 * projection - Optional fields to include/exclude
 */
async function getAll(model, filter = {}, projection = {}) {
  return await model.find(filter, projection).lean();
}

/**
 * Retrieve a single document
 * model
 * filter
 * projection
 */
async function getOne(model, filter = {}, projection = {}) {
  return await model.findOne(filter, projection).lean();
}

/**
 * Insert one document
 * model
 * data
 */
async function insertOne(model, data) {
  const doc = new model(data);
  return await doc.save();
}

/**
 * Insert many documents
 * model
 * dataArray
 */
async function insertMany(model, dataArray) {
  return await model.insertMany(dataArray, { ordered: false });
}

/**
 * Upsert a document
 * model
 * filter
 * data
 */
async function upsertOne(model, filter, data) {
  return await model.updateOne(filter, { $set: data }, { upsert: true });
}

/**
 * Upsert a document
 * model
 * filter
 */
async function deleteMany(model, filter = {}) {
  return await model.deleteMany(filter);
}

async function hasData(model) {
  try {
    const count = await model.estimatedDocumentCount();
    return count > 0;
  } catch (error) {
    console.error('Error checking data existence:', error);
    return false;
  }
}


export default{
    getAll,
    getOne,
    insertOne,
    insertMany,
    upsertOne,
    deleteMany,
    hasData
}