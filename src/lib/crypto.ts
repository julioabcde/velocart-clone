import * as CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'your-secret-key-change-in-production';

// ✅ Add warning for production
if (SECRET_KEY === 'your-secret-key-change-in-production' && process.env.NODE_ENV === 'production') {
  console.warn('🚨 WARNING: Using default crypto secret key in production! Please set NEXT_PUBLIC_CRYPTO_SECRET environment variable.');
}

export const crypto = {
  encrypt(text: string): string {
    try {
      if (!text) return '';
      return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  },

  decrypt(ciphertext: string): string {
    try {
      if (!ciphertext) return '';
      const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('Decryption resulted in empty string');
      }
      
      return decryptedText;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  },

  // ✅ Add utility method to check if string is encrypted
  isEncrypted(text: string): boolean {
    try {
      // Try to decrypt, if it fails, it's probably not encrypted
      this.decrypt(text);
      return true;
    } catch {
      return false;
    }
  },

  // ✅ Add method to safely decrypt (returns null if fails)
  safeDecrypt(ciphertext: string): string | null {
    try {
      return this.decrypt(ciphertext);
    } catch {
      return null;
    }
  }
};