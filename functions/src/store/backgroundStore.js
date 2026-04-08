const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const COLLECTION = 'backgrounds';

function db() {
  return admin.firestore();
}

async function getAllBackgrounds() {
  const snapshot = await db().collection(COLLECTION).get();
  return snapshot.docs.map(doc => doc.data());
}

async function getBackgroundById(id) {
  const doc = await db().collection(COLLECTION).doc(id).get();
  return doc.exists ? doc.data() : null;
}

async function createBackground({ url, riveFile }) {
  const background = { id: uuidv4(), url, riveFile, createdAt: new Date().toISOString() };
  await db().collection(COLLECTION).doc(background.id).set(background);
  return background;
}

async function updateBackground(id, { url, riveFile }) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ url, riveFile });
  return { ...doc.data(), url, riveFile };
}

async function deleteBackground(id) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

module.exports = { getAllBackgrounds, getBackgroundById, createBackground, updateBackground, deleteBackground };
