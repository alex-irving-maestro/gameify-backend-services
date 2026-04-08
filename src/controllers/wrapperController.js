const store = require('../store/wrapperStore');

async function listWrappers(req, res) {
  const wrappers = await store.getAllWrappers();
  res.json(wrappers);
}

async function getWrapper(req, res) {
  const wrapper = await store.getWrapperById(req.params.id);
  if (!wrapper) return res.status(404).json({ error: 'Wrapper not found' });
  res.json(wrapper);
}

async function createWrapper(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const wrapper = await store.createWrapper({ url, riveFile });
  res.status(201).json(wrapper);
}

async function updateWrapper(req, res) {
  const { url, riveFile } = req.body;
  const wrapper = await store.updateWrapper(req.params.id, { url, riveFile });
  if (!wrapper) return res.status(404).json({ error: 'Wrapper not found' });
  res.json(wrapper);
}

async function deleteWrapper(req, res) {
  const deleted = await store.deleteWrapper(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Wrapper not found' });
  res.status(204).send();
}

module.exports = { listWrappers, getWrapper, createWrapper, updateWrapper, deleteWrapper };
