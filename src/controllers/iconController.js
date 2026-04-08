const store = require('../store/iconStore');

async function listIcons(req, res) {
  const icons = await store.getAllIcons();
  res.json(icons);
}

async function getIcon(req, res) {
  const icon = await store.getIconById(req.params.id);
  if (!icon) return res.status(404).json({ error: 'Icon not found' });
  res.json(icon);
}

async function createIcon(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const icon = await store.createIcon({ url, riveFile });
  res.status(201).json(icon);
}

async function updateIcon(req, res) {
  const { url, riveFile } = req.body;
  const icon = await store.updateIcon(req.params.id, { url, riveFile });
  if (!icon) return res.status(404).json({ error: 'Icon not found' });
  res.json(icon);
}

async function deleteIcon(req, res) {
  const deleted = await store.deleteIcon(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Icon not found' });
  res.status(204).send();
}

module.exports = { listIcons, getIcon, createIcon, updateIcon, deleteIcon };
