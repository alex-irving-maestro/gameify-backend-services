const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase');

const collection = db.collection('wrappers');

async function getAllWrappers() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => doc.data());
}

async function getWrapperById(id) {
  const doc = await collection.doc(id).get();
  return doc.exists ? doc.data() : undefined;
}

async function createWrapper({ url, riveFile }) {
  const wrapper = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  await collection.doc(wrapper.id).set(wrapper);
  return wrapper;
}

async function updateWrapper(id, { url, riveFile }) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const updated = { ...doc.data(), url, riveFile };
  await collection.doc(id).set(updated);
  return updated;
}

async function deleteWrapper(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return false;
  await collection.doc(id).delete();
  return true;
}

module.exports = { getAllWrappers, getWrapperById, createWrapper, updateWrapper, deleteWrapper };
