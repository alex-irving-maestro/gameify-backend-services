const store = require('../store/iconStore');

function listIcons(req, res) {
  res.json(store.getAllIcons());
}

function getIcon(req, res) {
  const icon = store.getIconById(req.params.id);
  if (!icon) return res.status(404).json({ error: 'Icon not found' });
  res.json(icon);
}

function createIcon(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const icon = store.createIcon({ url, riveFile });
  res.status(201).json(icon);
}

function updateIcon(req, res) {
  const { url, riveFile } = req.body;
  const icon = store.updateIcon(req.params.id, { url, riveFile });
  if (!icon) return res.status(404).json({ error: 'Icon not found' });
  res.json(icon);
}

function deleteIcon(req, res) {
  const deleted = store.deleteIcon(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Icon not found' });
  res.status(204).send();
}

module.exports = { listIcons, getIcon, createIcon, updateIcon, deleteIcon };
