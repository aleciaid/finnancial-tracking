/**
 * Security utilities for the application
 */

/**
 * Hash a password using SHA-256
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against a stored hash
 * @param password - The plain text password to verify
 * @param storedHash - The stored hash to compare against
 * @returns True if the password matches the hash
 */
export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  try {
    const hashedPassword = await hashPassword(password);
    return hashedPassword === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Generate a random session token
 * @returns A random session token
 */
export const generateSessionToken = (): string => {
  const randomArray = new Uint8Array(16);
  crypto.getRandomValues(randomArray);
  return Array.from(randomArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Simple encryption for sensitive data
 * Note: This is not secure for truly sensitive data, but provides
 * basic obfuscation for localStorage
 */
export const encryptData = (data: string, key: string): string => {
  try {
    // Simple XOR encryption
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted); // Base64 encode
  } catch (error) {
    console.error('Error encrypting data:', error);
    return data; // Return original data if encryption fails
  }
};

/**
 * Simple decryption for sensitive data
 */
export const decryptData = (encryptedData: string, key: string): string => {
  try {
    const data = atob(encryptedData); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return encryptedData; // Return encrypted data if decryption fails
  }
};

/**
 * Check if session is still valid (not timed out)
 * @param lastActiveTimestamp - The timestamp of the last activity
 * @param inactivityLimit - The inactivity limit in milliseconds (default 30 minutes)
 * @returns True if the session is still valid
 */
export const isSessionValid = (
  lastActiveTimestamp: number, 
  inactivityLimit: number = 30 * 60 * 1000
): boolean => {
  const currentTime = Date.now();
  return currentTime - lastActiveTimestamp < inactivityLimit;
};