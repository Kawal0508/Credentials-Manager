import { Credential, User } from '../types';
import { EncryptionService } from '../utils/encryption';

export class StorageService {
  private static readonly USERS_KEY = 'credentials_manager_users';
  private static readonly CREDENTIALS_KEY = 'credentials_manager_credentials';
  private static readonly CURRENT_USER_KEY = 'credentials_manager_current_user';

  // User management
  static saveUser(user: User): void {
    const users = this.getUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static getUsers(): User[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    if (!usersJson) return [];
    
    try {
      const users = JSON.parse(usersJson);
      return users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }));
    } catch (error) {
      console.error('Error parsing users from storage:', error);
      return [];
    }
  }

  static getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  static getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (!userJson) return null;
    
    try {
      const user = JSON.parse(userJson);
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      };
    } catch (error) {
      console.error('Error parsing current user from storage:', error);
      return null;
    }
  }

  // Credential management
  static saveCredential(credential: Credential): void {
    const credentials = this.getCredentials();
    const existingCredentialIndex = credentials.findIndex(c => c.id === credential.id);
    
    if (existingCredentialIndex >= 0) {
      credentials[existingCredentialIndex] = credential;
    } else {
      credentials.push(credential);
    }
    
    // Encrypt sensitive data before storing
    const encryptedCredentials = credentials.map(cred => ({
      ...cred,
      password: EncryptionService.encrypt(cred.password),
    }));
    
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(encryptedCredentials));
  }

  static getCredentials(): Credential[] {
    const credentialsJson = localStorage.getItem(this.CREDENTIALS_KEY);
    if (!credentialsJson) return [];
    
    try {
      const encryptedCredentials = JSON.parse(credentialsJson);
      return encryptedCredentials.map((cred: any) => ({
        ...cred,
        password: EncryptionService.decrypt(cred.password),
        createdAt: new Date(cred.createdAt),
        updatedAt: new Date(cred.updatedAt),
      }));
    } catch (error) {
      console.error('Error parsing credentials from storage:', error);
      return [];
    }
  }

  static getCredentialsByUserId(userId: string): Credential[] {
    const credentials = this.getCredentials();
    return credentials.filter(cred => cred.userId === userId);
  }

  static getCredentialById(id: string): Credential | null {
    const credentials = this.getCredentials();
    return credentials.find(cred => cred.id === id) || null;
  }

  static deleteCredential(id: string): boolean {
    const credentials = this.getCredentials();
    const filteredCredentials = credentials.filter(cred => cred.id !== id);
    
    if (filteredCredentials.length === credentials.length) {
      return false; // Credential not found
    }
    
    // Encrypt sensitive data before storing
    const encryptedCredentials = filteredCredentials.map(cred => ({
      ...cred,
      password: EncryptionService.encrypt(cred.password),
    }));
    
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(encryptedCredentials));
    return true;
  }

  static searchCredentials(userId: string, query: string): Credential[] {
    const credentials = this.getCredentialsByUserId(userId);
    const lowercaseQuery = query.toLowerCase();
    
    return credentials.filter(cred => 
      cred.title.toLowerCase().includes(lowercaseQuery) ||
      cred.website?.toLowerCase().includes(lowercaseQuery) ||
      cred.username.toLowerCase().includes(lowercaseQuery) ||
      cred.category.toLowerCase().includes(lowercaseQuery) ||
      cred.notes?.toLowerCase().includes(lowercaseQuery)
    );
  }

  static getCredentialsByCategory(userId: string, category: string): Credential[] {
    const credentials = this.getCredentialsByUserId(userId);
    return credentials.filter(cred => cred.category === category);
  }

  static getFavoriteCredentials(userId: string): Credential[] {
    const credentials = this.getCredentialsByUserId(userId);
    return credentials.filter(cred => cred.isFavorite);
  }

  static clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CREDENTIALS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}
