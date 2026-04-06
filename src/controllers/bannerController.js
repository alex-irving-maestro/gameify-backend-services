const store = require('../store/bannerStore');

function listBanners(req, res) {
  res.json(store.getAllBanners());
}

function getBanner(req, res) {
  const banner = store.getBannerById(req.params.id);
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  res.json(banner);
}

function createBanner(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const banner = store.createBanner({ url, riveFile });
  res.status(201).json(banner);
}

function updateBanner(req, res) {
  const { url, riveFile } = req.body;
  const banner = store.updateBanner(req.params.id, { url, riveFile });
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  res.json(banner);
}

function deleteBanner(req, res) {
  const deleted = store.deleteBanner(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Banner not found' });
  res.status(204).send();
}

module.exports = { listBanners, getBanner, createBanner, updateBanner, deleteBanner };
