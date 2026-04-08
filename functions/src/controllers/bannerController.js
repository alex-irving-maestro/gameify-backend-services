const store = require('../store/bannerStore');

async function listBanners(req, res) {
  try {
    res.json(await store.getAllBanners());
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getBanner(req, res) {
  try {
    const banner = await store.getBannerById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createBanner(req, res) {
  try {
    const { url, riveFile } = req.body;
    if (!url || !riveFile) return res.status(400).json({ error: 'url and riveFile are required' });
    const banner = await store.createBanner({ url, riveFile });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateBanner(req, res) {
  try {
    const { url, riveFile } = req.body;
    const banner = await store.updateBanner(req.params.id, { url, riveFile });
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteBanner(req, res) {
  try {
    const deleted = await store.deleteBanner(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Banner not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { listBanners, getBanner, createBanner, updateBanner, deleteBanner };
