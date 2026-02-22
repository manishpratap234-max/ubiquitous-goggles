async function sendPushNotification({ userId, title, body, data = {} }) {
  // Integrate Firebase Cloud Messaging in production.
  console.log('Push notification', { userId, title, body, data });
}

module.exports = { sendPushNotification };
