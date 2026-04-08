const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const COLLECTION = 'icons';

function db() {
  return admin.firestore();
}

async function getAllIcons() {
  const snapshot = await db().collection(COLLECTION).get();
  return snapshot.docs.map(doc => doc.data());
}

async function getIconById(id) {
  const doc = await db().collection(COLLECTION).doc(id).get();
  return doc.exists ? doc.data() : null;
}

async function createIcon({ url, riveFile }) {
  const icon = { id: uuidv4(), url, riveFile, createdAt: new Date().toISOString() };
  await db().collection(COLLECTION).doc(icon.id).set(icon);
  return icon;
}

async function updateIcon(id, { url, riveFile }) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ url, riveFile });
  return { ...doc.data(), url, riveFile };
}

async function deleteIcon(id) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

module.exports = { getAllIcons, getIconById, createIcon, updateIcon, deleteIcon };
