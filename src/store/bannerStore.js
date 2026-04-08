const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase');

const collection = db.collection('banners');

async function getAllBanners() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => doc.data());
}

async function getBannerById(id) {
  const doc = await collection.doc(id).get();
  return doc.exists ? doc.data() : undefined;
}

async function createBanner({ url, riveFile }) {
  const banner = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  await collection.doc(banner.id).set(banner);
  return banner;
}

async function updateBanner(id, { url, riveFile }) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const updated = { ...doc.data(), url, riveFile };
  await collection.doc(id).set(updated);
  return updated;
}

async function deleteBanner(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return false;
  await collection.doc(id).delete();
  return true;
}

module.exports = { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner };
