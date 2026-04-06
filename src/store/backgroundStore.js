const { v4: uuidv4 } = require('uuid');
const { load, save } = require('./persist');

const FILE = 'backgrounds.json';
const backgrounds = load(FILE);

function getAllBackgrounds() {
  return Array.from(backgrounds.values());
}

function getBackgroundById(id) {
  return backgrounds.get(id);
}

function createBackground({ url, riveFile }) {
  const background = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  backgrounds.set(background.id, background);
  save(FILE, backgrounds);
  return background;
}

function updateBackground(id, { url, riveFile }) {
  const existing = backgrounds.get(id);
  if (!existing) return null;
  const updated = { ...existing, url, riveFile };
  backgrounds.set(id, updated);
  save(FILE, backgrounds);
  return updated;
}

function deleteBackground(id) {
  const result = backgrounds.delete(id);
  save(FILE, backgrounds);
  return result;
}

module.exports = { getAllBackgrounds, getBackgroundById, createBackground, updateBackground, deleteBackground };
