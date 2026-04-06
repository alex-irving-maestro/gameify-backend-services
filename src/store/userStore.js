const { v4: uuidv4 } = require('uuid');
const { load, save } = require('./persist');

const FILE = 'users.json';
const users = load(FILE);

const UNLOCK_TYPES = ['backgrounds', 'banners', 'icons', 'wrappers'];

function getAllUsers() {
  return Array.from(users.values());
}

function getUserById(id) {
  return users.get(id);
}

function createUser({ name, email, username }) {
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
  users.set(user.id, user);
  save(FILE, users);
  return user;
}

function updateUser(id, { name, email, username }) {
  const existing = users.get(id);
  if (!existing) return null;
  const updated = { ...existing, name, email, username };
  users.set(id, updated);
  save(FILE, users);
  return updated;
}

function deleteUser(id) {
  const result = users.delete(id);
  save(FILE, users);
  return result;
}

function unlockItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const user = users.get(userId);
  if (!user) return null;
  if (!user.unlocked[type].includes(itemId)) {
    user.unlocked[type].push(itemId);
  }
  save(FILE, users);
  return user;
}

function revokeItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const user = users.get(userId);
  if (!user) return null;
  user.unlocked[type] = user.unlocked[type].filter(id => id !== itemId);
  save(FILE, users);
  return user;
}

function getUnlockedItems(userId, type) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const user = users.get(userId);
  if (!user) return null;
  return user.unlocked[type];
}

function selectItem(userId, type, itemId) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const user = users.get(userId);
  if (!user) return null;
  if (!user.unlocked[type].includes(itemId)) return 'not_unlocked';
  const singularType = type.slice(0, -1);
  user.selectedTypes[singularType] = itemId;
  save(FILE, users);
  return user;
}

function deselectItem(userId, type) {
  if (!UNLOCK_TYPES.includes(type)) return null;
  const user = users.get(userId);
  if (!user) return null;
  const singularType = type.slice(0, -1);
  user.selectedTypes[singularType] = null;
  save(FILE, users);
  return user;
}

function unlockAllItems(userId, allItems) {
  const user = users.get(userId);
  if (!user) return null;
  for (const type of UNLOCK_TYPES) {
    const ids = (allItems[type] || []).map(item => item.id);
    for (const id of ids) {
      if (!user.unlocked[type].includes(id)) {
        user.unlocked[type].push(id);
      }
    }
  }
  save(FILE, users);
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
