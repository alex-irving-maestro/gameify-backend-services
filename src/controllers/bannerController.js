const store = require('../store/bannerStore');

async function listBanners(req, res) {
  const banners = await store.getAllBanners();
  res.json(banners);
}

async function getBanner(req, res) {
  const banner = await store.getBannerById(req.params.id);
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  res.json(banner);
}

async function createBanner(req, res) {
  const { url, riveFile } = req.body;
  if (!url || !riveFile) {
    return res.status(400).json({ error: 'url and riveFile are required' });
  }
  const banner = await store.createBanner({ url, riveFile });
  res.status(201).json(banner);
}

async function updateBanner(req, res) {
  const { url, riveFile } = req.body;
  const banner = await store.updateBanner(req.params.id, { url, riveFile });
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  res.json(banner);
}

async function deleteBanner(req, res) {
  const deleted = await store.deleteBanner(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Banner not found' });
  res.status(204).send();
}

module.exports = { listBanners, getBanner, createBanner, updateBanner, deleteBanner };
