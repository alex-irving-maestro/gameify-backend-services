const { v4: uuidv4 } = require('uuid');
const { load, save } = require('./persist');

const FILE = 'icons.json';
const icons = load(FILE);

function getAllIcons() {
  return Array.from(icons.values());
}

function getIconById(id) {
  return icons.get(id);
}

function createIcon({ url, riveFile }) {
  const icon = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  icons.set(icon.id, icon);
  save(FILE, icons);
  return icon;
}

function updateIcon(id, { url, riveFile }) {
  const existing = icons.get(id);
  if (!existing) return null;
  const updated = { ...existing, url, riveFile };
  icons.set(id, updated);
  save(FILE, icons);
  return updated;
}

function deleteIcon(id) {
  const result = icons.delete(id);
  save(FILE, icons);
  return result;
}

module.exports = { getAllIcons, getIconById, createIcon, updateIcon, deleteIcon };
