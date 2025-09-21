import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Credential } from '../types';
import { EncryptionService } from '../utils/encryption';

export class FirebaseStorageService {
  private static readonly CREDENTIALS_COLLECTION = 'credentials';

  static async saveCredential(credential: Credential): Promise<string> {
    try {
      // Debug: Check if user is authenticated
      const { auth } = await import('../config/firebase');
      console.log('Current user:', auth.currentUser);
      console.log('Credential userId:', credential.userId);
      
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Filter out undefined values before saving to Firestore
      const credentialData: any = {
        userId: credential.userId,
        title: credential.title,
        username: credential.username,
        password: EncryptionService.encrypt(credential.password),
        category: credential.category,
        createdAt: Timestamp.fromDate(credential.createdAt),
        updatedAt: Timestamp.fromDate(credential.updatedAt),
        isFavorite: credential.isFavorite,
      };

      // Only add optional fields if they have values
      if (credential.website && credential.website.trim() !== '') {
        credentialData.website = credential.website;
      }
      if (credential.notes && credential.notes.trim() !== '') {
        credentialData.notes = credential.notes;
      }

      if (credential.id && credential.id !== '') {
        // Update existing credential
        const docRef = doc(db, this.CREDENTIALS_COLLECTION, credential.id);
        await updateDoc(docRef, credentialData);
        return credential.id;
      } else {
        // Create new credential
        const docRef = await addDoc(collection(db, this.CREDENTIALS_COLLECTION), credentialData);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving credential:', error);
      throw error;
    }
  }

  static async getCredentials(userId: string): Promise<Credential[]> {
    try {
      const q = query(
        collection(db, this.CREDENTIALS_COLLECTION),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const credentials: Credential[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        credentials.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          website: data.website || undefined,
          username: data.username,
          password: EncryptionService.decrypt(data.password),
          notes: data.notes || undefined,
          category: data.category,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          isFavorite: data.isFavorite,
        });
      });

      // Sort by createdAt descending (newest first)
      credentials.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return credentials;
    } catch (error) {
      console.error('Error getting credentials:', error);
      throw error;
    }
  }

  static async deleteCredential(credentialId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.CREDENTIALS_COLLECTION, credentialId));
    } catch (error) {
      console.error('Error deleting credential:', error);
      throw error;
    }
  }

  static async searchCredentials(userId: string, searchQuery: string): Promise<Credential[]> {
    try {
      const credentials = await this.getCredentials(userId);
      const lowercaseQuery = searchQuery.toLowerCase();
      
      return credentials.filter(cred => 
        cred.title.toLowerCase().includes(lowercaseQuery) ||
        cred.website?.toLowerCase().includes(lowercaseQuery) ||
        cred.username.toLowerCase().includes(lowercaseQuery) ||
        cred.category.toLowerCase().includes(lowercaseQuery) ||
        cred.notes?.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching credentials:', error);
      throw error;
    }
  }

  static async getCredentialsByCategory(userId: string, category: string): Promise<Credential[]> {
    try {
      const credentials = await this.getCredentials(userId);
      return credentials.filter(cred => cred.category === category);
    } catch (error) {
      console.error('Error getting credentials by category:', error);
      throw error;
    }
  }

  static async getFavoriteCredentials(userId: string): Promise<Credential[]> {
    try {
      const credentials = await this.getCredentials(userId);
      return credentials.filter(cred => cred.isFavorite);
    } catch (error) {
      console.error('Error getting favorite credentials:', error);
      throw error;
    }
  }

  // Real-time listener for credentials
  static subscribeToCredentials(userId: string, callback: (credentials: Credential[]) => void) {
    console.log('Setting up real-time listener for userId:', userId);
    const q = query(
      collection(db, this.CREDENTIALS_COLLECTION),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (querySnapshot) => {
      console.log('Firestore snapshot received:', querySnapshot.size, 'documents');
      const credentials: Credential[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Processing document:', doc.id, data);
        credentials.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          website: data.website || undefined,
          username: data.username,
          password: EncryptionService.decrypt(data.password),
          notes: data.notes || undefined,
          category: data.category,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          isFavorite: data.isFavorite,
        });
      });
      
      // Sort by createdAt descending (newest first)
      credentials.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log('Final credentials array:', credentials);
      callback(credentials);
    }, (error) => {
      console.error('Firestore listener error:', error);
    });
  }

  // Export all user data
  static async exportUserData(userId: string): Promise<{ credentials: Credential[], exportDate: string, userInfo: any }> {
    try {
      const credentials = await this.getCredentials(userId);
      const { auth } = await import('../config/firebase');
      const user = auth.currentUser;
      
      const exportData = {
        credentials: credentials,
        exportDate: new Date().toISOString(),
        userInfo: {
          userId: userId,
          email: user?.email || 'Unknown',
          exportVersion: '1.0',
          totalCredentials: credentials.length,
          categories: Array.from(new Set(credentials.map(c => c.category))),
          favorites: credentials.filter(c => c.isFavorite).length
        }
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  // Delete all user data
  static async deleteAllUserData(userId: string): Promise<void> {
    try {
      const credentials = await this.getCredentials(userId);
      
      // Delete all credentials
      const deletePromises = credentials.map(credential => 
        this.deleteCredential(credential.id)
      );
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }
}
