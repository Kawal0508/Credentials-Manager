import { PasswordGeneratorOptions } from '../types';

export type { PasswordGeneratorOptions };

export class PasswordGenerator {
  private static readonly UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly NUMBERS = '0123456789';
  private static readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  private static readonly SIMILAR_CHARS = 'il1Lo0O';
  private static readonly AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;.<>';

  static generatePassword(options: PasswordGeneratorOptions): string {
    let charset = '';
    let password = '';

    // Build character set based on options
    if (options.includeUppercase) {
      charset += this.UPPERCASE;
    }
    if (options.includeLowercase) {
      charset += this.LOWERCASE;
    }
    if (options.includeNumbers) {
      charset += this.NUMBERS;
    }
    if (options.includeSymbols) {
      charset += this.SYMBOLS;
    }

    // Remove similar characters if requested
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !this.SIMILAR_CHARS.includes(char)).join('');
    }

    // Remove ambiguous characters if requested
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !this.AMBIGUOUS_CHARS.includes(char)).join('');
    }

    if (charset.length === 0) {
      throw new Error('No character set available for password generation');
    }

    // Ensure at least one character from each selected category
    if (options.includeUppercase && password.indexOf(this.UPPERCASE[Math.floor(Math.random() * this.UPPERCASE.length)]) === -1) {
      password += this.UPPERCASE[Math.floor(Math.random() * this.UPPERCASE.length)];
    }
    if (options.includeLowercase && password.indexOf(this.LOWERCASE[Math.floor(Math.random() * this.LOWERCASE.length)]) === -1) {
      password += this.LOWERCASE[Math.floor(Math.random() * this.LOWERCASE.length)];
    }
    if (options.includeNumbers && password.indexOf(this.NUMBERS[Math.floor(Math.random() * this.NUMBERS.length)]) === -1) {
      password += this.NUMBERS[Math.floor(Math.random() * this.NUMBERS.length)];
    }
    if (options.includeSymbols && password.indexOf(this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)]) === -1) {
      password += this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)];
    }

    // Fill remaining length with random characters
    for (let i = password.length; i < options.length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return this.shuffleString(password);
  }

  private static shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  static getDefaultOptions(): PasswordGeneratorOptions {
    return {
      length: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
      excludeAmbiguous: false,
    };
  }
}
