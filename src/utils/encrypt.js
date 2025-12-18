import { createCipheriv } from 'crypto';

/**
 * Encrypts a password using AES-256-ECB mode.
 *
 * @param {string} unEncryptPwd - The plaintext password to encrypt.
 * @param {string} secretKey - The Base64-encoded 256-bit secret key.
 * @returns {string} - The encrypted password as a Base64 string.
 */
 function getEncryptPwd(unEncryptPwd, secretKey) {
    // Convert the secret key from Base64 to a Buffer
    const key = Buffer.from(secretKey, 'base64');

    // Convert the plaintext password to a Buffer
    const data = Buffer.from(unEncryptPwd, 'utf8');

    // Create a cipher instance using AES-256-ECB
    const cipher = createCipheriv('aes-256-ecb', key, null); // ECB mode doesn't use an IV
    cipher.setAutoPadding(true); // Enable PKCS7 padding

    // Encrypt the data
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

    // Return the encrypted data as a Base64 string
    return encrypted.toString('base64');
}

export default getEncryptPwd;


// // Example usage
// const unEncryptPwd = "Password@2345";
// const secretKey = "uro1elgXN9p5r9AaEjOOFn8uChjNCmEEmizEfiTJkBM="; // Must be a 256-bit key encoded in Base64
// const encryptedPwd = getEncryptPwd(unEncryptPwd, secretKey);
// console.log(encryptedPwd);
