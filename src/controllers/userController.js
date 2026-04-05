const store = require('../store/userStore');

function listUsers(req, res) {
  res.json(store.getAllUsers());
}

function getUser(req, res) {
  const user = store.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

function createUser(req, res) {
  const { name, email, username } = req.body;
  if (!name || !email || !username) {
    return res.status(400).json({ error: 'name, email, and username are required' });
  }
  const user = store.createUser({ name, email, username });
  res.status(201).json(user);
}

function updateUser(req, res) {
  const { name, email, username } = req.body;
  const user = store.updateUser(req.params.id, { name, email, username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

function deleteUser(req, res) {
  const deleted = store.deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'User not found' });
  res.status(204).send();
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
