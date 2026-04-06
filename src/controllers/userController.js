const store = require('../store/userStore');
const backgroundStore = require('../store/backgroundStore');
const bannerStore = require('../store/bannerStore');
const iconStore = require('../store/iconStore');
const wrapperStore = require('../store/wrapperStore');

const itemStores = {
  backgrounds: backgroundStore,
  banners: bannerStore,
  icons: iconStore,
  wrappers: wrapperStore,
};

const itemGetters = {
  backgrounds: (id) => backgroundStore.getBackgroundById(id),
  banners: (id) => bannerStore.getBannerById(id),
  icons: (id) => iconStore.getIconById(id),
  wrappers: (id) => wrapperStore.getWrapperById(id),
};

function listUsers(req, res) {
  res.json(store.getAllUsers());
}

function getUser(req, res) {
  const user = store.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

function createUser(req, res) {
  const { name, email, username } = req.body;
  if (!name || !email || !username) {
    return res.status(400).json({ error: 'name, email, and username are required' });
  }
  const user = store.createUser({ name, email, username });
  res.status(201).json(user);
}

function updateUser(req, res) {
  const { name, email, username } = req.body;
  const user = store.updateUser(req.params.id, { name, email, username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

function deleteUser(req, res) {
  const deleted = store.deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.status(204).send();
}

function getUnlocked(req, res) {
  const { type } = req.params;
  const unlockedIds = store.getUnlockedItems(req.params.id, type);
  if (unlockedIds === null) return res.status(404).json({ error: 'User not found' });
  const items = unlockedIds.map(itemId => itemGetters[type](itemId)).filter(Boolean);
  res.json(items);
}

function unlockItem(req, res) {
  const { id, type, itemId } = req.params;
  const item = itemGetters[type](itemId);
  if (!item) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });
  const user = store.unlockItem(id, type, itemId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

function revokeItem(req, res) {
  const { id, type, itemId } = req.params;
  const user = store.revokeItem(id, type, itemId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

function selectItem(req, res) {
  const { id, type, itemId } = req.params;
  const result = store.selectItem(id, type, itemId);
  if (result === null) return res.status(404).json({ error: 'User not found' });
  if (result === 'not_unlocked') return res.status(403).json({ error: 'Item is not unlocked for this user' });
  res.json(result);
}

function deselectItem(req, res) {
  const { id, type } = req.params;
  const user = store.deselectItem(id, type);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

function unlockAll(req, res) {
  const allItems = {
    backgrounds: backgroundStore.getAllBackgrounds(),
    banners: bannerStore.getAllBanners(),
    icons: iconStore.getAllIcons(),
    wrappers: wrapperStore.getAllWrappers(),
  };
  const user = store.unlockAllItems(req.params.id, allItems);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser, getUnlocked, unlockItem, revokeItem, unlockAll, selectItem, deselectItem };
