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
  try {
    res.json(await store.getAllUsers());
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUser(req, res) {
  try {
    const user = await store.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, username } = req.body;
    if (!name || !email || !username) {
      return res.status(400).json({ error: 'name, email, and username are required' });
    }
    // Use the Firebase Auth UID (req.uid) as the Firestore document ID
    const user = await store.createUser({ id: req.uid, name, email, username });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, username } = req.body;
    const user = await store.updateUser(req.params.id, { name, email, username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const deleted = await store.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUnlocked(req, res) {
  try {
    const { type } = req.params;
    const unlockedIds = await store.getUnlockedItems(req.params.id, type);
    if (unlockedIds === null) return res.status(404).json({ error: 'User not found' });
    const items = await Promise.all(unlockedIds.map(itemId => itemGetters[type](itemId)));
    res.json(items.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function unlockItem(req, res) {
  try {
    const { id, type, itemId } = req.params;
    const item = await itemGetters[type](itemId);
    if (!item) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });
    const user = await store.unlockItem(id, type, itemId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function revokeItem(req, res) {
  try {
    const { id, type, itemId } = req.params;
    const user = await store.revokeItem(id, type, itemId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function selectItem(req, res) {
  try {
    const { id, type, itemId } = req.params;
    const result = await store.selectItem(id, type, itemId);
    if (result === null) return res.status(404).json({ error: 'User not found' });
    if (result === 'not_unlocked') return res.status(403).json({ error: 'Item is not unlocked for this user' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deselectItem(req, res) {
  try {
    const { id, type } = req.params;
    const user = await store.deselectItem(id, type);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function unlockAll(req, res) {
  try {
    const allItems = {
      backgrounds: await backgroundStore.getAllBackgrounds(),
      banners: await bannerStore.getAllBanners(),
      icons: await iconStore.getAllIcons(),
      wrappers: await wrapperStore.getAllWrappers(),
    };
    const user = await store.unlockAllItems(req.params.id, allItems);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  listUsers, getUser, createUser, updateUser, deleteUser,
  getUnlocked, unlockItem, revokeItem, unlockAll, selectItem, deselectItem,
};
