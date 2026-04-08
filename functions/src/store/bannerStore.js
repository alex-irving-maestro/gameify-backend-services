const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const COLLECTION = 'banners';

function db() {
  return admin.firestore();
}

async function getAllBanners() {
  const snapshot = await db().collection(COLLECTION).get();
  return snapshot.docs.map(doc => doc.data());
}

async function getBannerById(id) {
  const doc = await db().collection(COLLECTION).doc(id).get();
  return doc.exists ? doc.data() : null;
}

async function createBanner({ url, riveFile }) {
  const banner = { id: uuidv4(), url, riveFile, createdAt: new Date().toISOString() };
  await db().collection(COLLECTION).doc(banner.id).set(banner);
  return banner;
}

async function updateBanner(id, { url, riveFile }) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ url, riveFile });
  return { ...doc.data(), url, riveFile };
}

async function deleteBanner(id) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

module.exports = { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner };
