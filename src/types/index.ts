export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Credential {
  id: string;
  userId: string;
  title: string;
  website?: string;
  username: string;
  password: string;
  notes?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: number;
  feedback: string;
  suggestions: string[];
  isStrong: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface CredentialFormData {
  title: string;
  website: string;
  username: string;
  password: string;
  notes: string;
  category: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  autoLock: boolean;
  autoLockTimeout: number;
  masterPasswordRequired: boolean;
}
