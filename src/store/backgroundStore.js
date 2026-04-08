const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase');

const collection = db.collection('backgrounds');

async function getAllBackgrounds() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => doc.data());
}

async function getBackgroundById(id) {
  const doc = await collection.doc(id).get();
  return doc.exists ? doc.data() : undefined;
}

async function createBackground({ url, riveFile }) {
  const background = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  await collection.doc(background.id).set(background);
  return background;
}

async function updateBackground(id, { url, riveFile }) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const updated = { ...doc.data(), url, riveFile };
  await collection.doc(id).set(updated);
  return updated;
}

async function deleteBackground(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return false;
  await collection.doc(id).delete();
  return true;
}

module.exports = { getAllBackgrounds, getBackgroundById, createBackground, updateBackground, deleteBackground };
