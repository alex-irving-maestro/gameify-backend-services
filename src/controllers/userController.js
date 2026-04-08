const store = require('../store/userStore');
const backgroundStore = require('../store/backgroundStore');
const bannerStore = require('../store/bannerStore');
const iconStore = require('../store/iconStore');
const wrapperStore = require('../store/wrapperStore');

const itemGetters = {
  backgrounds: (id) => backgroundStore.getBackgroundById(id),
  banners: (id) => bannerStore.getBannerById(id),
  icons: (id) => iconStore.getIconById(id),
  wrappers: (id) => wrapperStore.getWrapperById(id),
};

async function listUsers(req, res) {
  const users = await store.getAllUsers();
  res.json(users);
}

async function getUser(req, res) {
  const user = await store.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

async function createUser(req, res) {
  const { name, email, username } = req.body;
  if (!name || !email || !username) {
    return res.status(400).json({ error: 'name, email, and username are required' });
  }
  const user = await store.createUser({ name, email, username });
  res.status(201).json(user);
}

async function updateUser(req, res) {
  const { name, email, username } = req.body;
  const user = await store.updateUser(req.params.id, { name, email, username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

async function deleteUser(req, res) {
  const deleted = await store.deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.status(204).send();
}

async function getUnlocked(req, res) {
  const { type } = req.params;
  const unlockedIds = await store.getUnlockedItems(req.params.id, type);
  if (unlockedIds === null) return res.status(404).json({ error: 'User not found' });
  const items = await Promise.all(unlockedIds.map(itemId => itemGetters[type](itemId)));
  res.json(items.filter(Boolean));
}

async function unlockItem(req, res) {
  const { id, type, itemId } = req.params;
  const item = await itemGetters[type](itemId);
  if (!item) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });
  const user = await store.unlockItem(id, type, itemId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

async function revokeItem(req, res) {
  const { id, type, itemId } = req.params;
  const user = await store.revokeItem(id, type, itemId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

async function selectItem(req, res) {
  const { id, type, itemId } = req.params;
  const result = await store.selectItem(id, type, itemId);
  if (result === null) return res.status(404).json({ error: 'User not found' });
  if (result === 'not_unlocked') return res.status(403).json({ error: 'Item is not unlocked for this user' });
  res.json(result);
}

async function deselectItem(req, res) {
  const { id, type } = req.params;
  const user = await store.deselectItem(id, type);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

async function unlockAll(req, res) {
  const [backgrounds, banners, icons, wrappers] = await Promise.all([
    backgroundStore.getAllBackgrounds(),
    bannerStore.getAllBanners(),
    iconStore.getAllIcons(),
    wrapperStore.getAllWrappers(),
  ]);
  const allItems = { backgrounds, banners, icons, wrappers };
  const user = await store.unlockAllItems(req.params.id, allItems);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser, getUnlocked, unlockItem, revokeItem, unlockAll, selectItem, deselectItem };
