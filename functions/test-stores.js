/**
 * Integration tests for all Firestore stores.
 * Runs against the live Firebase Firestore instance.
 *
 * Usage: node test-stores.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../gameify-ctv-firebase-adminsdk-fbsvc-940c03772b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gameify-ctv',
});

const userStore = require('./src/store/userStore');
const backgroundStore = require('./src/store/backgroundStore');
const bannerStore = require('./src/store/bannerStore');
const iconStore = require('./src/store/iconStore');
const wrapperStore = require('./src/store/wrapperStore');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    failed++;
  } else {
    console.log(`  PASS: ${message}`);
    passed++;
  }
}

async function testBackgroundStore() {
  console.log('\n--- backgroundStore ---');

  const created = await backgroundStore.createBackground({ url: 'http://bg.png', riveFile: 'bg.riv' });
  assert(created && created.id, 'createBackground returns object with id');
  assert(created.url === 'http://bg.png', 'createBackground sets url');

  const fetched = await backgroundStore.getBackgroundById(created.id);
  assert(fetched && fetched.id === created.id, 'getBackgroundById returns created doc');

  const updated = await backgroundStore.updateBackground(created.id, { url: 'http://bg2.png', riveFile: 'bg2.riv' });
  assert(updated && updated.url === 'http://bg2.png', 'updateBackground returns updated data');

  const all = await backgroundStore.getAllBackgrounds();
  assert(all.some(b => b.id === created.id), 'getAllBackgrounds includes created doc');

  const deleted = await backgroundStore.deleteBackground(created.id);
  assert(deleted === true, 'deleteBackground returns true');

  const afterDelete = await backgroundStore.getBackgroundById(created.id);
  assert(afterDelete === null, 'getBackgroundById returns null after delete');
}

async function testBannerStore() {
  console.log('\n--- bannerStore ---');

  const created = await bannerStore.createBanner({ url: 'http://ban.png', riveFile: 'ban.riv' });
  assert(created && created.id, 'createBanner returns object with id');

  const fetched = await bannerStore.getBannerById(created.id);
  assert(fetched && fetched.id === created.id, 'getBannerById returns created doc');

  const updated = await bannerStore.updateBanner(created.id, { url: 'http://ban2.png', riveFile: 'ban2.riv' });
  assert(updated && updated.url === 'http://ban2.png', 'updateBanner returns updated data');

  const all = await bannerStore.getAllBanners();
  assert(all.some(b => b.id === created.id), 'getAllBanners includes created doc');

  const deleted = await bannerStore.deleteBanner(created.id);
  assert(deleted === true, 'deleteBanner returns true');
}

async function testIconStore() {
  console.log('\n--- iconStore ---');

  const created = await iconStore.createIcon({ url: 'http://ico.png', riveFile: 'ico.riv' });
  assert(created && created.id, 'createIcon returns object with id');

  const fetched = await iconStore.getIconById(created.id);
  assert(fetched && fetched.id === created.id, 'getIconById returns created doc');

  const updated = await iconStore.updateIcon(created.id, { url: 'http://ico2.png', riveFile: 'ico2.riv' });
  assert(updated && updated.url === 'http://ico2.png', 'updateIcon returns updated data');

  const all = await iconStore.getAllIcons();
  assert(all.some(i => i.id === created.id), 'getAllIcons includes created doc');

  const deleted = await iconStore.deleteIcon(created.id);
  assert(deleted === true, 'deleteIcon returns true');
}

async function testWrapperStore() {
  console.log('\n--- wrapperStore ---');

  const created = await wrapperStore.createWrapper({ url: 'http://wrap.png', riveFile: 'wrap.riv' });
  assert(created && created.id, 'createWrapper returns object with id');

  const fetched = await wrapperStore.getWrapperById(created.id);
  assert(fetched && fetched.id === created.id, 'getWrapperById returns created doc');

  const updated = await wrapperStore.updateWrapper(created.id, { url: 'http://wrap2.png', riveFile: 'wrap2.riv' });
  assert(updated && updated.url === 'http://wrap2.png', 'updateWrapper returns updated data');

  const all = await wrapperStore.getAllWrappers();
  assert(all.some(w => w.id === created.id), 'getAllWrappers includes created doc');

  const deleted = await wrapperStore.deleteWrapper(created.id);
  assert(deleted === true, 'deleteWrapper returns true');
}

async function testUserStore() {
  console.log('\n--- userStore ---');

  const userId = 'test-user-' + Date.now();
  const created = await userStore.createUser({ id: userId, name: 'Test', email: 'test@test.com', username: 'tester' });
  assert(created && created.id === userId, 'createUser returns user with correct id');
  assert(created.unlocked.backgrounds.length === 0, 'createUser initializes empty unlocked arrays');
  assert(created.selectedTypes.background === null, 'createUser initializes null selectedTypes');

  const fetched = await userStore.getUserById(userId);
  assert(fetched && fetched.id === userId, 'getUserById returns created user');

  const updated = await userStore.updateUser(userId, { name: 'Updated', email: 'new@test.com', username: 'newuser' });
  assert(updated && updated.name === 'Updated', 'updateUser returns updated data');

  const all = await userStore.getAllUsers();
  assert(all.some(u => u.id === userId), 'getAllUsers includes created user');

  // Test unlock flow
  const bg = await backgroundStore.createBackground({ url: 'http://test.png', riveFile: 'test.riv' });

  const unlocked = await userStore.unlockItem(userId, 'backgrounds', bg.id);
  assert(unlocked && unlocked.unlocked.backgrounds.includes(bg.id), 'unlockItem adds item to unlocked array');

  const unlockedItems = await userStore.getUnlockedItems(userId, 'backgrounds');
  assert(unlockedItems && unlockedItems.includes(bg.id), 'getUnlockedItems returns unlocked item');

  // Test select/deselect
  const selected = await userStore.selectItem(userId, 'backgrounds', bg.id);
  assert(selected && selected.selectedTypes.background === bg.id, 'selectItem sets selected type');

  const deselected = await userStore.deselectItem(userId, 'backgrounds');
  assert(deselected && deselected.selectedTypes.background === null, 'deselectItem clears selected type');

  // Test selectItem for non-unlocked item
  const notUnlocked = await userStore.selectItem(userId, 'backgrounds', 'fake-id');
  assert(notUnlocked === 'not_unlocked', 'selectItem returns not_unlocked for non-unlocked item');

  // Test revokeItem
  const revoked = await userStore.revokeItem(userId, 'backgrounds', bg.id);
  assert(revoked && !revoked.unlocked.backgrounds.includes(bg.id), 'revokeItem removes item from unlocked array');

  // Test unlockAllItems
  const ico = await iconStore.createIcon({ url: 'http://i.png', riveFile: 'i.riv' });
  const allItemsResult = await userStore.unlockAllItems(userId, {
    backgrounds: [bg],
    icons: [ico],
    banners: [],
    wrappers: [],
  });
  assert(allItemsResult && allItemsResult.unlocked.backgrounds.includes(bg.id), 'unlockAllItems unlocks backgrounds');
  assert(allItemsResult && allItemsResult.unlocked.icons.includes(ico.id), 'unlockAllItems unlocks icons');

  // Test invalid type
  const invalidType = await userStore.getUnlockedItems(userId, 'invalid');
  assert(invalidType === null, 'getUnlockedItems returns null for invalid type');

  // Cleanup
  await userStore.deleteUser(userId);
  const afterDelete = await userStore.getUserById(userId);
  assert(afterDelete === null, 'getUserById returns null after delete');

  await backgroundStore.deleteBackground(bg.id);
  await iconStore.deleteIcon(ico.id);
}

async function main() {
  console.log('=== Firestore Store Integration Tests (LIVE) ===');
  console.log('Project: gameify-ctv\n');

  try {
    await testBackgroundStore();
    await testBannerStore();
    await testIconStore();
    await testWrapperStore();
    await testUserStore();
  } catch (err) {
    console.error('\nUNEXPECTED ERROR:', err);
    failed++;
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
