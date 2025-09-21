# Firebase Setup Guide

## 🔥 Setting up Firebase for your Credentials Manager

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "Credentials Manager" (or any name you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location for your database
5. Click "Done"

### Step 4: Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Enter app name: "Credentials Manager"
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

### Step 5: Update Firebase Configuration

Replace the placeholder values in `src/config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 6: Set up Firestore Security Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own credentials
    match /credentials/{credentialId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

### Step 7: Test Your Application

1. Start your React app: `npm start`
2. Open `http://localhost:3000`
3. Register a new account
4. Add some credentials
5. Check Firebase Console to see your data

## 🔒 Security Features

- **User Authentication**: Only authenticated users can access the app
- **Data Isolation**: Users can only see their own credentials
- **Encryption**: All passwords are encrypted before storing
- **Real-time Sync**: Changes sync across devices instantly

## 📱 Benefits of Firebase Integration

- **Cloud Storage**: Data stored securely in the cloud
- **Real-time Updates**: Changes appear instantly across all devices
- **Offline Support**: App works offline and syncs when online
- **Scalability**: Handles growth automatically
- **Security**: Built-in authentication and security rules

## 🚨 Important Notes

- Never commit your Firebase config with real API keys to public repositories
- Use environment variables for production
- Regularly review and update your security rules
- Monitor your Firebase usage and costs

## 🆘 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your API key in the Firebase config

2. **"Missing or insufficient permissions"**
   - Check your Firestore security rules
   - Ensure user is authenticated

3. **"Firebase: Error (auth/user-not-found)"**
   - User needs to register first

4. **"Firebase: Error (auth/wrong-password)"**
   - Check password is correct

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
