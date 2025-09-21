import CryptoJS from 'crypto-js';

const SECRET_KEY = 'credentials-manager-secret-key-2024';

export class EncryptionService {
  private static getKey(): string {
    // In a real application, this should be derived from user's master password
    return SECRET_KEY;
  }

  static encrypt(text: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, this.getKey()).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.getKey());
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  static verifyPassword(password: string, hashedPassword: string): boolean {
    const hashedInput = this.hashPassword(password);
    return hashedInput === hashedPassword;
  }
}
