const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase');

const collection = db.collection('icons');

async function getAllIcons() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => doc.data());
}

async function getIconById(id) {
  const doc = await collection.doc(id).get();
  return doc.exists ? doc.data() : undefined;
}

async function createIcon({ url, riveFile }) {
  const icon = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  await collection.doc(icon.id).set(icon);
  return icon;
}

async function updateIcon(id, { url, riveFile }) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const updated = { ...doc.data(), url, riveFile };
  await collection.doc(id).set(updated);
  return updated;
}

async function deleteIcon(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return false;
  await collection.doc(id).delete();
  return true;
}

module.exports = { getAllIcons, getIconById, createIcon, updateIcon, deleteIcon };
