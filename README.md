# Credentials Manager

A secure, modern password management application built with React and TypeScript. This application provides a comprehensive solution for managing passwords, generating secure passwords, and checking password strength.

## Features

### 🔐 Password Management
- **Secure Storage**: Store passwords with AES encryption
- **Organized Categories**: Organize credentials by categories (Social Media, Email, Banking, etc.)
- **Search & Filter**: Quickly find credentials with powerful search functionality
- **Favorites**: Mark important credentials as favorites
- **Copy to Clipboard**: One-click copying of usernames and passwords

### 🔑 Password Generator
- **Customizable Parameters**: Control length, character types, and exclusions
- **Character Options**: Uppercase, lowercase, numbers, and symbols
- **Exclusion Options**: Exclude similar or ambiguous characters
- **Real-time Generation**: Generate passwords instantly with visual feedback
- **Strength Indicator**: Visual password strength assessment

### 🛡️ Password Checker
- **Real-time Analysis**: Check password strength as you type
- **Comprehensive Scoring**: Multi-factor password strength evaluation
- **Security Suggestions**: Get specific recommendations for improvement
- **Visual Feedback**: Color-coded strength indicators and progress bars

### 🔒 Security Features
- **AES Encryption**: All sensitive data is encrypted before storage
- **Local Storage**: Data stored locally for privacy and offline access
- **Secure Authentication**: User authentication with password hashing
- **Session Management**: Secure login/logout functionality

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Bootstrap Integration**: Professional, modern interface
- **Dark/Light Theme**: Clean, accessible design
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Real-time Feedback**: Instant visual feedback for all actions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Bootstrap 5 with React Bootstrap
- **Icons**: Lucide React
- **Encryption**: CryptoJS for AES encryption
- **Storage**: Local Storage for offline functionality
- **Build Tool**: Create React App with TypeScript template

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credentials-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## Usage

### Getting Started

1. **Create an Account**: Register with your email and username
2. **Sign In**: Use your credentials to access the dashboard
3. **Add Credentials**: Click "Add Credential" to store your first password
4. **Generate Passwords**: Use the Password Generator for secure passwords
5. **Check Strength**: Use the Password Checker to evaluate existing passwords

### Managing Credentials

- **Adding Credentials**: Fill in the title, website, username, and password
- **Categorizing**: Choose from predefined categories or use "Other"
- **Searching**: Use the search bar to quickly find specific credentials
- **Favorites**: Mark important credentials as favorites for quick access
- **Editing**: Click the menu button on any credential to edit or delete

### Password Generator

- **Length Control**: Adjust password length from 4 to 50 characters
- **Character Types**: Select which character types to include
- **Exclusions**: Exclude similar or ambiguous characters
- **Copy**: One-click copying to clipboard
- **Strength**: Real-time strength assessment

### Password Checker

- **Real-time Analysis**: Check passwords as you type
- **Security Assessment**: Comprehensive evaluation of password strength
- **Suggestions**: Get specific recommendations for improvement
- **Visual Feedback**: Color-coded strength indicators

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Login form component
│   ├── Register.tsx    # Registration form component
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── CredentialList.tsx # Credential display component
│   ├── PasswordGenerator.tsx # Password generator component
│   ├── PasswordChecker.tsx # Password strength checker
│   ├── AddCredentialModal.tsx # Add credential modal
│   └── SearchCredentials.tsx # Search functionality
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── services/           # Business logic services
│   └── storageService.ts # Local storage management
├── utils/              # Utility functions
│   ├── encryption.ts   # Encryption/decryption utilities
│   ├── passwordGenerator.ts # Password generation logic
│   └── passwordChecker.ts # Password strength checking
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
└── App.tsx            # Main application component
```

## Security Considerations

### Current Implementation
- **Local Storage**: All data is stored locally in the browser
- **AES Encryption**: Sensitive data is encrypted before storage
- **Password Hashing**: User passwords are hashed using SHA-256
- **No Network Requests**: All operations are performed locally

### Future Enhancements
- **Cloud Storage**: Integration with secure cloud storage services
- **Two-Factor Authentication**: Additional security layer
- **Biometric Authentication**: Fingerprint/face recognition support
- **Master Password**: User-defined master password for encryption
- **Backup & Sync**: Secure backup and synchronization across devices

## Development

### Available Scripts

- `npm start`: Start the development server
- `npm run build`: Build the application for production
- `npm test`: Run the test suite
- `npm run eject`: Eject from Create React App (not recommended)

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Functional components with hooks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Password storage and management
- [x] Password generator
- [x] Password strength checker
- [x] Local storage implementation

### Phase 2: Enhanced Security
- [ ] Master password implementation
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Enhanced encryption algorithms

### Phase 3: Cloud Integration
- [ ] Cloud storage integration
- [ ] Cross-device synchronization
- [ ] Backup and restore functionality
- [ ] OAuth integration

### Phase 4: Advanced Features
- [ ] Password sharing
- [ ] Team management
- [ ] Security audit reports
- [ ] Browser extension
- [ ] Mobile app

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **React Team**: For the amazing React framework
- **Bootstrap Team**: For the comprehensive UI framework
- **CryptoJS**: For the encryption utilities
- **Lucide**: For the beautiful icon set

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/credentials-manager/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Note**: This is a demonstration project. For production use, consider additional security measures and professional security audits.