const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

function load(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return new Map();
  const raw = fs.readFileSync(filepath, 'utf8');
  return new Map(JSON.parse(raw));
}

function save(filename, map) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(Array.from(map.entries())));
}

module.exports = { load, save };
