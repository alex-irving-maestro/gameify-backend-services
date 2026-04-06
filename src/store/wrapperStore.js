const { v4: uuidv4 } = require('uuid');
const { load, save } = require('./persist');

const FILE = 'wrappers.json';
const wrappers = load(FILE);

function getAllWrappers() {
  return Array.from(wrappers.values());
}

function getWrapperById(id) {
  return wrappers.get(id);
}

function createWrapper({ url, riveFile }) {
  const wrapper = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  wrappers.set(wrapper.id, wrapper);
  save(FILE, wrappers);
  return wrapper;
}

function updateWrapper(id, { url, riveFile }) {
  const existing = wrappers.get(id);
  if (!existing) return null;
  const updated = { ...existing, url, riveFile };
  wrappers.set(id, updated);
  save(FILE, wrappers);
  return updated;
}

function deleteWrapper(id) {
  const result = wrappers.delete(id);
  save(FILE, wrappers);
  return result;
}

module.exports = { getAllWrappers, getWrapperById, createWrapper, updateWrapper, deleteWrapper };
