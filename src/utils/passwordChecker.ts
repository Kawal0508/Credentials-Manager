import { PasswordStrength } from '../types';

export class PasswordChecker {
  static checkStrength(password: string): PasswordStrength {
    const score = this.calculateScore(password);
    const feedback = this.getFeedback(score);
    const suggestions = this.getSuggestions(password, score);
    const isStrong = score >= 4;

    return {
      score,
      feedback,
      suggestions,
      isStrong,
    };
  }

  private static calculateScore(password: string): number {
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Character variety
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Pattern checks (penalties)
    if (this.hasRepeatingChars(password)) score--;
    if (this.hasSequentialChars(password)) score--;
    if (this.hasCommonPatterns(password)) score--;
    if (this.hasCommonWords(password)) score--;

    return Math.max(0, Math.min(5, score));
  }

  private static getFeedback(score: number): string {
    switch (score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return 'Unknown';
    }
  }

  private static getSuggestions(password: string, score: number): string[] {
    const suggestions: string[] = [];

    if (password.length < 8) {
      suggestions.push('Use at least 8 characters');
    } else if (password.length < 12) {
      suggestions.push('Consider using 12 or more characters');
    }

    if (!/[a-z]/.test(password)) {
      suggestions.push('Add lowercase letters');
    }

    if (!/[A-Z]/.test(password)) {
      suggestions.push('Add uppercase letters');
    }

    if (!/[0-9]/.test(password)) {
      suggestions.push('Add numbers');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      suggestions.push('Add special characters');
    }

    if (this.hasRepeatingChars(password)) {
      suggestions.push('Avoid repeating characters');
    }

    if (this.hasSequentialChars(password)) {
      suggestions.push('Avoid sequential characters');
    }

    if (this.hasCommonPatterns(password)) {
      suggestions.push('Avoid common patterns');
    }

    if (this.hasCommonWords(password)) {
      suggestions.push('Avoid common words');
    }

    return suggestions;
  }

  private static hasRepeatingChars(password: string): boolean {
    return /(.)\1{2,}/.test(password);
  }

  private static hasSequentialChars(password: string): boolean {
    const sequences = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
    const lowerPassword = password.toLowerCase();
    return sequences.some(seq => lowerPassword.includes(seq));
  }

  private static hasCommonPatterns(password: string): boolean {
    const patterns = ['123', '321', 'qwe', 'asd', 'zxc', 'qaz', 'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm'];
    const lowerPassword = password.toLowerCase();
    return patterns.some(pattern => lowerPassword.includes(pattern));
  }

  private static hasCommonWords(password: string): boolean {
    const commonWords = ['password', '123456', 'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome', 'monkey', 'dragon'];
    const lowerPassword = password.toLowerCase();
    return commonWords.some(word => lowerPassword.includes(word));
  }

  static getStrengthColor(score: number): string {
    switch (score) {
      case 0:
      case 1:
        return '#dc3545'; // Red
      case 2:
        return '#fd7e14'; // Orange
      case 3:
        return '#ffc107'; // Yellow
      case 4:
        return '#20c997'; // Teal
      case 5:
        return '#198754'; // Green
      default:
        return '#6c757d'; // Gray
    }
  }
}
