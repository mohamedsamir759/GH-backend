const { prepareEgldControlChangesEsdtSignedTransaction } = require('@tatumio/tatum');

module.exports = {
  port: process.env.PORT,
  currentEnvironment: process.env.ENVIRONMENT,
  mongoUrl: process.env.MONGO_URI,
  cpUrl: process.env.CLIENT_PORTAL_URL || 'https://crypto-client-portal.herokuapp.com/',
  clientName: process.env.CLIENT_NAME || 'ITGeeks',
  clientLogo: process.env.CLIENT_NAME || 'https://exinitiweb.blob.core.windows.net/data/assets/FINAL_EXINITI_LOGO_01_24a4e050ba.png',
  crmTokenTime: {
    jwtTime: '12h',
    seconds: 60 * 60 * 12,
  },
  cpTokenTime: {
    jwtTime: '24h',
    seconds: 60 * 60 * 24,
  },
  cpResetPasswordTokenTime: {
    jwtTime: '1h',
    seconds: 60 * 60,
  },
  twoFactorAuthTokenTime: {
    jwtTime: '1h',
    seconds: 60 * 60,
  },
  chartDataTime: {
    '24h': 60 * 30,
    '7d': 60 * 60 * 4,
    '30d': 60 * 60 * 24,
  },
  jwtKey: process.env.JWT_KEY || 'hahtesgsdfsdkljlhwjsdfsdf',
  isLogDirectoryEnabled: true,
  passwordSalt: 'sdfsdf7sd6f8s7difu',
  tatum: {
    apiKey: process.env.TATUM_API_KEY,
  },
  kycDocuments: ['ID', 'ADDRESS'],
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    d: 0,
  },
  backendURL: process.env.BACKEND_URL,
  crmURL: `${process.env.BACKEND_URL}api/v1/crm/`,
  binanceKeys: {
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_SECRET,
  },
  ftxKeys: {
    apiKey: process.env.FTX_API_KEY,
    secret: process.env.FTX_SECRET,
  },
  demoMode: process.env.DEMO_MODE || true,
  twoFAClientName: process.env.CLIENT_NAME || 'ITGeeks',
};
