const store = require('../store/backgroundStore');

async function listBackgrounds(req, res) {
  try {
    res.json(await store.getAllBackgrounds());
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getBackground(req, res) {
  try {
    const background = await store.getBackgroundById(req.params.id);
    if (!background) return res.status(404).json({ error: 'Background not found' });
    res.json(background);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createBackground(req, res) {
  try {
    const { url, riveFile } = req.body;
    if (!url || !riveFile) return res.status(400).json({ error: 'url and riveFile are required' });
    const background = await store.createBackground({ url, riveFile });
    res.status(201).json(background);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateBackground(req, res) {
  try {
    const { url, riveFile } = req.body;
    const background = await store.updateBackground(req.params.id, { url, riveFile });
    if (!background) return res.status(404).json({ error: 'Background not found' });
    res.json(background);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteBackground(req, res) {
  try {
    const deleted = await store.deleteBackground(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Background not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { listBackgrounds, getBackground, createBackground, updateBackground, deleteBackground };
