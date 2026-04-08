const store = require('../store/wrapperStore');

async function listWrappers(req, res) {
  try {
    res.json(await store.getAllWrappers());
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getWrapper(req, res) {
  try {
    const wrapper = await store.getWrapperById(req.params.id);
    if (!wrapper) return res.status(404).json({ error: 'Wrapper not found' });
    res.json(wrapper);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createWrapper(req, res) {
  try {
    const { url, riveFile } = req.body;
    if (!url || !riveFile) return res.status(400).json({ error: 'url and riveFile are required' });
    const wrapper = await store.createWrapper({ url, riveFile });
    res.status(201).json(wrapper);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateWrapper(req, res) {
  try {
    const { url, riveFile } = req.body;
    const wrapper = await store.updateWrapper(req.params.id, { url, riveFile });
    if (!wrapper) return res.status(404).json({ error: 'Wrapper not found' });
    res.json(wrapper);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteWrapper(req, res) {
  try {
    const deleted = await store.deleteWrapper(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Wrapper not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { listWrappers, getWrapper, createWrapper, updateWrapper, deleteWrapper };
