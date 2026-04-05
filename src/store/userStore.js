const { v4: uuidv4 } = require('uuid');

const users = new Map();

function getAllUsers() {
  return Array.from(users.values());
}

function getUserById(id) {
  return users.get(id);
}

function createUser({ name, email, username }) {
  const user = {
    id: uuidv4(),
    name,
    email,
    username,
    createdAt: new Date().toISOString(),
  };
  users.set(user.id, user);
  return user;
}

function updateUser(id, { name, email, username }) {
  const existing = users.get(id);
  if (!existing) return null;
  const updated = { ...existing, name, email, username };
  users.set(id, updated);
  return updated;
}

function deleteUser(id) {
  return users.delete(id);
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
