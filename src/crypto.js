import CryptoJS from 'crypto-js';
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY; 



export const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    const urlSafeEncrypted = encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return urlSafeEncrypted;
  };


  export const decryptId = (urlSafeEncryptedId) => {
    const encrypted = urlSafeEncryptedId.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };