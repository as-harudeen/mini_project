const crypto = require('crypto');

function encryptData(data, password) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  return {
    iv: iv.toString('hex'),
    encryptedData,
  };
}


function decryptData(encryptedData, password, iv) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}


// Usage example:
// const originalData = 'Hello,';
// const password = 'supersecret';

// const encrypted = encryptData(originalData, password);
// console.log(encrypted)
// console.log('Encrypted:', encrypted);

// const decrypted = decryptData(Encrypted.encryptedData, password, Encrypted.iv);
// console.log('Decrypted:', decrypted);

module.exports = {encryptData, decryptData}