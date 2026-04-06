const store = require('../store/backgroundStore');

function listBackgrounds(req, res) {
  res.json(store.getAllBackgrounds());
}

function getBackground(req, res) {
  const background = store.getBackgroundById(req.params.id);
  if (!background) return res.status(404).json({ error: 'Background not found' });
  res.json(background);
}

function createBackground(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const background = store.createBackground({ url, riveFile });
  res.status(201).json(background);
}

function updateBackground(req, res) {
  const { url, riveFile } = req.body;
  const background = store.updateBackground(req.params.id, { url, riveFile });
  if (!background) return res.status(404).json({ error: 'Background not found' });
  res.json(background);
}

function deleteBackground(req, res) {
  const deleted = store.deleteBackground(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Background not found' });
  res.status(204).send();
}

module.exports = { listBackgrounds, getBackground, createBackground, updateBackground, deleteBackground };
