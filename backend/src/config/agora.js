const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const agoraConfig = {
  appId: process.env.AGORA_APP_ID,
  appCertificate: process.env.AGORA_APP_CERTIFICATE,
  customerId: process.env.AGORA_CUSTOMER_ID,
  customerSecret: process.env.AGORA_CUSTOMER_SECRET,
  apiBaseUrl: process.env.AGORA_API_BASE_URL,
};

// Generate RTC token for user to join channel
const generateRtcToken = (channelName, uid, role = RtcRole.PUBLISHER) => {
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  return RtcTokenBuilder.buildTokenWithUid(
    agoraConfig.appId,
    agoraConfig.appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
};

// Generate Basic Auth for Agora REST API
const getAgoraAuthHeader = () => {
  const credentials = `${agoraConfig.customerId}:${agoraConfig.customerSecret}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

module.exports = {
  agoraConfig,
  generateRtcToken,
  getAgoraAuthHeader,
};
