const { 
  enableFX,
  enableCrypto,
  enableIB,
  enableMM,
  enableGold,
} = require("config");
const { cpUrl } = require("content");

let dedicatedLinks = [];
dedicatedLinks.push(`${cpUrl}/register/crypto/live`);

export default dedicatedLinks;