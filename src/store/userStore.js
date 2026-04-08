const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase');

const collection = db.collection('users');
const UNLOCK_TYPES = ['backgrounds', 'banners', 'icons', 'wrappers'];

async function getAllUsers() {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => doc.data());
}

async function getUserById(id) {
  const doc = await collection.doc(id).get();
  return doc.exists ? doc.data() : undefined;
}

async function createUser({ name, email, username }) {
  const user = {
    id: uuidv4(),
    name,
    email,
    username,
    unlocked: {
      backgrounds: [],
      banners: [],
      icons: [],
      wrappers: [],
    },
    selectedTypes: {
      background: null,
      banner: null,
      icon: null,
      wrapper: null,
    },
    createdAt: new Date().toISOString(),
  };
  await collection.doc(user.id).set(user);
  return user;
}

async function updateUser(id, { name, email, username }) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  const updated = { ...doc.data(), name, email, username };
  await collection.doc(id).set(updated);
  return updated;
}

async function deleteUser(id) {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return false;
  await collection.doc(id).delete();
  return true;
}

async function unlockItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const doc = await collection.doc(userId).get();
  if (!doc.exists) return null;
  const user = doc.data();
  if (!user.unlocked[type].includes(itemId)) {
    user.unlocked[type].push(itemId);
  }
  await collection.doc(userId).set(user);
  return user;
}

async function revokeItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const doc = await collection.doc(userId).get();
  if (!doc.exists) return null;
  const user = doc.data();
  user.unlocked[type] = user.unlocked[type].filter(id => id !== itemId);
  await collection.doc(userId).set(user);
  return user;
}

async function getUnlockedItems(userId, type) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const doc = await collection.doc(userId).get();
  if (!doc.exists) return null;
  return doc.data().unlocked[type];
}

async function selectItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const doc = await collection.doc(userId).get();
  if (!doc.exists) return null;
  const user = doc.data();
  if (!user.unlocked[type].includes(itemId)) return 'not_unlocked';
  const singularType = type.slice(0, -1);
  user.selectedTypes[singularType] = itemId;
  await collection.doc(userId).set(user);
  return user;
}

async function deselectItem(userId, type) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const doc = await collection.doc(userId).get();
  if (!doc.exists) return null;
  const user = doc.data();
  const singularType = type.slice(0, -1);
  user.selectedTypes[singularType] = null;
  await collection.doc(userId).set(user);
  return user;
}

async function unlockAllItems(userId, allItems) {
  const doc = await collection.doc(userId).get();
  if (!doc.exists) return null;
  const user = doc.data();
  for (const type of UNLOCK_TYPES) {
    const ids = (allItems[type] || []).map(item => item.id);
    for (const id of ids) {
      if (!user.unlocked[type].includes(id)) {
        user.unlocked[type].push(id);
      }
    }
  }
  await collection.doc(userId).set(user);
  return user;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  unlockItem,
  revokeItem,
  getUnlockedItems,
  unlockAllItems,
  selectItem,
  deselectItem,
};
