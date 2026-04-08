const store = require('../store/backgroundStore');

async function listBackgrounds(req, res) {
  const backgrounds = await store.getAllBackgrounds();
  res.json(backgrounds);
}

async function getBackground(req, res) {
  const background = await store.getBackgroundById(req.params.id);
  if (!background) return res.status(404).json({ error: 'Background not found' });
  res.json(background);
}

async function createBackground(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const background = await store.createBackground({ url, riveFile });
  res.status(201).json(background);
}

async function updateBackground(req, res) {
  const { url, riveFile } = req.body;
  const background = await store.updateBackground(req.params.id, { url, riveFile });
  if (!background) return res.status(404).json({ error: 'Background not found' });
  res.json(background);
}

async function deleteBackground(req, res) {
  const deleted = await store.deleteBackground(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Background not found' });
  res.status(204).send();
}

module.exports = { listBackgrounds, getBackground, createBackground, updateBackground, deleteBackground };
