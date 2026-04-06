const store = require('../store/wrapperStore');

function listWrappers(req, res) {
  res.json(store.getAllWrappers());
}

function getWrapper(req, res) {
  const wrapper = store.getWrapperById(req.params.id);
  if (!wrapper) return res.status(404).json({ error: 'Wrapper not found' });
  res.json(wrapper);
}

function createWrapper(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const wrapper = store.createWrapper({ url, riveFile });
  res.status(201).json(wrapper);
}

function updateWrapper(req, res) {
  const { url, riveFile } = req.body;
  const wrapper = store.updateWrapper(req.params.id, { url, riveFile });
  if (!wrapper) return res.status(404).json({ error: 'Wrapper not found' });
  res.json(wrapper);
}

function deleteWrapper(req, res) {
  const deleted = store.deleteWrapper(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Wrapper not found' });
  res.status(204).send();
}

module.exports = { listWrappers, getWrapper, createWrapper, updateWrapper, deleteWrapper };
