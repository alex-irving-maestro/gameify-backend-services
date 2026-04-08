const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');

// Initialize before importing app (stores call admin.firestore() at module level)
admin.initializeApp();

const app = require('./src/app');

exports.api = onRequest({ region: 'us-central1' }, app);
