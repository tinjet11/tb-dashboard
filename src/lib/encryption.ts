//https://dev.to/cristhianleonli/encrypted-localstorage-with-zustand-4fdi

import { PersistStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";

export class EncryptedStorage implements PersistStorage<any> {
  private nonce: string = import.meta.env.VITE_ENCRYPTION_KEY;

  // Decrypting the stored item
  getItem(key: string): Promise<any | undefined> {
    return new Promise((resolve) => {
      const value = localStorage.getItem(key);

      if (value) {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(value, this.nonce);
          const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
          resolve(JSON.parse(decryptedValue)); // Assuming the value is JSON
        } catch (error) {
          console.error("Failed to decrypt value:", error);
          resolve(undefined);
        }
      } else {
        resolve(undefined);
      }
    });
  }

  // Encrypting and setting the item
  setItem(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), this.nonce).toString();
      localStorage.setItem(key, encrypted);
      resolve();
    });
  }

  // Removing the item
  removeItem(key: string): Promise<void> {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      resolve();
    });
  }
}
