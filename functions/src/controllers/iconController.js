const store = require('../store/iconStore');

async function listIcons(req, res) {
  try {
    res.json(await store.getAllIcons());
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getIcon(req, res) {
  try {
    const icon = await store.getIconById(req.params.id);
    if (!icon) return res.status(404).json({ error: 'Icon not found' });
    res.json(icon);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createIcon(req, res) {
  try {
    const { url, riveFile } = req.body;
    if (!url || !riveFile) return res.status(400).json({ error: 'url and riveFile are required' });
    const icon = await store.createIcon({ url, riveFile });
    res.status(201).json(icon);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateIcon(req, res) {
  try {
    const { url, riveFile } = req.body;
    const icon = await store.updateIcon(req.params.id, { url, riveFile });
    if (!icon) return res.status(404).json({ error: 'Icon not found' });
    res.json(icon);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteIcon(req, res) {
  try {
    const deleted = await store.deleteIcon(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Icon not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { listIcons, getIcon, createIcon, updateIcon, deleteIcon };
