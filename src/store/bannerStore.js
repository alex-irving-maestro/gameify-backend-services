const { v4: uuidv4 } = require('uuid');
const { load, save } = require('./persist');

const FILE = 'banners.json';
const banners = load(FILE);

function getAllBanners() {
  return Array.from(banners.values());
}

function getBannerById(id) {
  return banners.get(id);
}

function createBanner({ url, riveFile }) {
  const banner = {
    id: uuidv4(),
    url,
    riveFile,
    createdAt: new Date().toISOString(),
  };
  banners.set(banner.id, banner);
  save(FILE, banners);
  return banner;
}

function updateBanner(id, { url, riveFile }) {
  const existing = banners.get(id);
  if (!existing) return null;
  const updated = { ...existing, url, riveFile };
  banners.set(id, updated);
  save(FILE, banners);
  return updated;
}

function deleteBanner(id) {
  const result = banners.delete(id);
  save(FILE, banners);
  return result;
}

module.exports = { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner };
