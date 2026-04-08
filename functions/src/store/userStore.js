const admin = require('firebase-admin');

const COLLECTION = 'users';
const UNLOCK_TYPES = ['backgrounds', 'banners', 'icons', 'wrappers'];

function db() {
  return admin.firestore();
}

async function getAllUsers() {
  const snapshot = await db().collection(COLLECTION).get();
  return snapshot.docs.map(doc => doc.data());
}

async function getUserById(id) {
  const doc = await db().collection(COLLECTION).doc(id).get();
  return doc.exists ? doc.data() : null;
}

async function createUser({ id, name, email, username }) {
  const user = {
    id,
    name,
    email,
    username,
    unlocked: { backgrounds: [], banners: [], icons: [], wrappers: [] },
    selectedTypes: { background: null, banner: null, icon: null, wrapper: null },
    createdAt: new Date().toISOString(),
  };
  await db().collection(COLLECTION).doc(id).set(user);
  return user;
}

async function updateUser(id, { name, email, username }) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ name, email, username });
  return { ...doc.data(), name, email, username };
}

async function deleteUser(id) {
  const ref = db().collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

async function getUnlockedItems(userId, type) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const doc = await db().collection(COLLECTION).doc(userId).get();
  if (!doc.exists) return null;
  return doc.data().unlocked[type];
}

async function unlockItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const ref = db().collection(COLLECTION).doc(userId);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({
    [`unlocked.${type}`]: admin.firestore.FieldValue.arrayUnion(itemId),
  });
  const updated = await ref.get();
  return updated.data();
}

async function revokeItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const ref = db().collection(COLLECTION).doc(userId);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({
    [`unlocked.${type}`]: admin.firestore.FieldValue.arrayRemove(itemId),
  });
  const updated = await ref.get();
  return updated.data();
}

async function selectItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const ref = db().collection(COLLECTION).doc(userId);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const user = doc.data();
  if (!user.unlocked[type].includes(itemId)) return 'not_unlocked';
  const singularType = type.slice(0, -1);
  await ref.update({ [`selectedTypes.${singularType}`]: itemId });
  return { ...user, selectedTypes: { ...user.selectedTypes, [singularType]: itemId } };
}

async function deselectItem(userId, type) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const ref = db().collection(COLLECTION).doc(userId);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const user = doc.data();
  const singularType = type.slice(0, -1);
  await ref.update({ [`selectedTypes.${singularType}`]: null });
  return { ...user, selectedTypes: { ...user.selectedTypes, [singularType]: null } };
}

async function unlockAllItems(userId, allItems) {
  const ref = db().collection(COLLECTION).doc(userId);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const updates = {};
  for (const type of UNLOCK_TYPES) {
    const ids = (allItems[type] || []).map(item => item.id);
    if (ids.length > 0) {
      updates[`unlocked.${type}`] = admin.firestore.FieldValue.arrayUnion(...ids);
    }
  }
  await ref.update(updates);
  const updated = await ref.get();
  return updated.data();
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUnlockedItems,
  unlockItem,
  revokeItem,
  selectItem,
  deselectItem,
  unlockAllItems,
};
