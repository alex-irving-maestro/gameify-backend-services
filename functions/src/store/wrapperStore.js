const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const COLLECTION = 'wrappers';

function db() {
  return admin.firestore();
}

async function getAllWrappers() {
  const snapshot = await db().collection(COLLECTION).get();
  return snapshot.docs.map(doc => doc.data());
}

async function getWrapperById(id) {
  const doc = await db().collection(COLLECTION).doc(id).get();
  return doc.exists ? doc.data() : null;
}

async function createWrapper({ url, riveFile }) {
  const wrapper = { id: uuidv4(), url, riveFile, createdAt: new Date().toISOString() };
  await db().collection(COLLECTION).doc(wrapper.id).set(wrapper);
  return wrapper;
}

async function updateWrapper(id, { url, riveFile }) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ url, riveFile });
  return { ...doc.data(), url, riveFile };
}

async function deleteWrapper(id) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

module.exports = { getAllWrappers, getWrapperById, createWrapper, updateWrapper, deleteWrapper };
