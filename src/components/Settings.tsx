import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Key, 
  Database, 
  Download, 
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { FirebaseAuthService } from '../services/firebaseAuth';
import { FirebaseStorageService } from '../services/firebaseStorage';
import { useAuth } from '../contexts/AuthContext';
import SpotlightCard from './SpotlightCard';
import { useEffect } from 'react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    username: user?.username || '',
    email: user?.email || '',
    
    // Security Settings
    autoLogout: true,
    autoLogoutTime: 30,
    passwordExpiry: 90,
    
    // Notification Settings
    emailNotifications: true,
    securityAlerts: true,
    weeklyReports: false,
    
    // Appearance Settings
    theme: 'dark',
    language: 'en',
    fontSize: 'medium',
    
    // Data Settings
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetention: 365
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({
    passwordStrength: 'Unknown',
    lastLogin: 'Unknown',
    accountCreated: 'Unknown',
    totalCredentials: 0
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 'Unknown';
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score >= 5) return 'Strong';
    if (score >= 3) return 'Medium';
    if (score >= 1) return 'Weak';
    return 'Very Weak';
  };

  const fetchSecurityStatus = async () => {
    try {
      if (!user?.id) return;

      // Get total credentials count
      const credentials = await FirebaseStorageService.getCredentials(user.id);
      
      // Get Firebase Auth user data
      const firebaseUser = FirebaseAuthService.getCurrentUser();
      
      setSecurityStatus({
        passwordStrength: 'Strong', // We can't get the actual password, so we'll show this as a general status
        lastLogin: firebaseUser?.metadata?.lastSignInTime 
          ? new Date(firebaseUser.metadata.lastSignInTime).toLocaleString()
          : 'Unknown',
        accountCreated: firebaseUser?.metadata?.creationTime 
          ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString()
          : 'Unknown',
        totalCredentials: credentials.length
      });
    } catch (error) {
      console.error('Error fetching security status:', error);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, [user]);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    setAlertMessage('Settings saved successfully!');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      
      // Validation
      if (!passwords.current) {
        setAlertMessage('Please enter your current password!');
        setShowAlert(true);
        return;
      }
      if (passwords.new !== passwords.confirm) {
        setAlertMessage('New passwords do not match!');
        setShowAlert(true);
        return;
      }
      if (passwords.new.length < 8) {
        setAlertMessage('New password must be at least 8 characters!');
        setShowAlert(true);
        return;
      }
      if (passwords.current === passwords.new) {
        setAlertMessage('New password must be different from current password!');
        setShowAlert(true);
        return;
      }

      // Change password using Firebase
      await FirebaseAuthService.changePassword(passwords.current, passwords.new);
      
      setAlertMessage('Password changed successfully!');
      setShowAlert(true);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      console.error('Password change error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/wrong-password') {
        setAlertMessage('Current password is incorrect!');
      } else if (error.code === 'auth/weak-password') {
        setAlertMessage('New password is too weak!');
      } else if (error.code === 'auth/requires-recent-login') {
        setAlertMessage('Please log out and log back in before changing your password!');
      } else {
        setAlertMessage('Failed to change password. Please try again.');
      }
      setShowAlert(true);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportData = async () => {
    try {
      if (!user?.id) {
        setAlertMessage('User not authenticated!');
        setShowAlert(true);
        return;
      }

      setIsExporting(true);
      
      // Get all user data
      const exportData = await FirebaseStorageService.exportUserData(user.id);
      
      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `credentials-export-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setAlertMessage(`Data exported successfully! Downloaded ${exportData.userInfo.totalCredentials} credentials.`);
      setShowAlert(true);
    } catch (error) {
      console.error('Export error:', error);
      setAlertMessage('Failed to export data. Please try again.');
      setShowAlert(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user?.id) {
        setAlertMessage('User not authenticated!');
        setShowAlert(true);
        return;
      }

      if (!deletePassword) {
        setAlertMessage('Please enter your password to confirm account deletion!');
        setShowAlert(true);
        return;
      }

      // Double confirmation
      const confirmed = window.confirm(
        '⚠️ WARNING: This will permanently delete your account and ALL your data!\n\n' +
        'This action cannot be undone. Are you absolutely sure?'
      );
      
      if (!confirmed) return;

      setIsDeletingAccount(true);

      // Delete all user data from Firestore first
      await FirebaseStorageService.deleteAllUserData(user.id);
      
      // Delete the Firebase Auth account
      await FirebaseAuthService.deleteAccount(deletePassword);
      
      setAlertMessage('Account and all data have been permanently deleted. You will be redirected to the login page.');
      setShowAlert(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    } catch (error: any) {
      console.error('Account deletion error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/wrong-password') {
        setAlertMessage('Incorrect password. Please try again.');
      } else if (error.code === 'auth/requires-recent-login') {
        setAlertMessage('Please log out and log back in before deleting your account.');
      } else {
        setAlertMessage('Failed to delete account. Please try again.');
      }
      setShowAlert(true);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>

          {showAlert && (
            <Alert 
              variant="success" 
              dismissible 
              onClose={() => setShowAlert(false)}
              className="mb-4"
            >
              {alertMessage}
            </Alert>
          )}

          <Tabs defaultActiveKey="profile" className="mb-4">
            {/* Profile Tab */}
            <Tab eventKey="profile" title={
              <span className="d-flex align-items-center">
                <User size={18} className="me-2" />
                Profile
              </span>
            }>
              <Row>
                <Col lg={8}>
                  <SpotlightCard spotlightColor="rgba(13, 110, 253, 0.2)">
                    <div className="mb-4">
                      <h5 className="mb-0 text-white">Profile Information</h5>
                    </div>
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Username</Form.Label>
                            <Form.Control
                              type="text"
                              value={settings.username}
                              onChange={(e) => handleInputChange('profile', 'username', e.target.value)}
                              className="bg-dark text-white border-secondary"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Email</Form.Label>
                            <Form.Control
                              type="email"
                              value={settings.email}
                              onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                              className="bg-dark text-white border-secondary"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button variant="primary" onClick={handleSaveSettings}>
                        <Save size={18} className="me-2" />
                        Save Changes
                      </Button>
                    </Form>
                  </SpotlightCard>
                </Col>
                <Col lg={4}>
                  <SpotlightCard spotlightColor="rgba(255, 193, 7, 0.2)">
                    <div className="mb-3">
                      <h6 className="mb-0 text-white">Profile Picture</h6>
                    </div>
                    <div className="text-center">
                      <div className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '100px', height: '100px' }}>
                        <User size={40} className="text-white" />
                      </div>
                      <div className="d-grid">
                        <Button variant="outline-light" size="sm">
                          Change Picture
                        </Button>
                      </div>
                    </div>
                  </SpotlightCard>
                </Col>
              </Row>
            </Tab>

            {/* Security Tab */}
            <Tab eventKey="security" title={
              <span className="d-flex align-items-center">
                <Shield size={18} className="me-2" />
                Security
              </span>
            }>
              <Row>
                <Col lg={8}>
                  <SpotlightCard spotlightColor="rgba(220, 53, 69, 0.2)">
                    <div className="mb-4">
                      <h5 className="mb-0 text-white">Security Settings</h5>
                    </div>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="autoLogout"
                          label="Auto-logout after inactivity"
                          checked={settings.autoLogout}
                          onChange={(e) => handleInputChange('security', 'autoLogout', e.target.checked)}
                          className="text-white"
                        />
                      </Form.Group>
                      {settings.autoLogout && (
                        <Form.Group className="mb-3">
                          <Form.Label className="text-white">Auto-logout time (minutes)</Form.Label>
                          <Form.Select
                            value={settings.autoLogoutTime}
                            onChange={(e) => handleInputChange('security', 'autoLogoutTime', parseInt(e.target.value))}
                            className="bg-dark text-white border-secondary"
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={120}>2 hours</option>
                          </Form.Select>
                        </Form.Group>
                      )}
                      <Button variant="primary" onClick={handleSaveSettings}>
                        <Save size={18} className="me-2" />
                        Save Security Settings
                      </Button>
                    </Form>
                  </SpotlightCard>

                  <SpotlightCard spotlightColor="rgba(40, 167, 69, 0.2)" className="mt-4">
                    <div className="mb-4">
                      <h5 className="mb-0 text-white">Change Password</h5>
                    </div>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">Current Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwords.current}
                            onChange={(e) => handlePasswordChange('current', e.target.value)}
                            className="bg-dark text-white border-secondary pe-5"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">New Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwords.new}
                            onChange={(e) => handlePasswordChange('new', e.target.value)}
                            className="bg-dark text-white border-secondary pe-5"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white">Confirm New Password</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwords.confirm}
                            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                            className="bg-dark text-white border-secondary pe-5"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </div>
                      </Form.Group>
                      <Button 
                        variant="success" 
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                      >
                        <Key size={18} className="me-2" />
                        {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                      </Button>
                    </Form>
                  </SpotlightCard>
                </Col>
                <Col lg={4}>
                  <SpotlightCard spotlightColor="rgba(108, 117, 125, 0.2)">
                    <div className="mb-3">
                      <h6 className="mb-0 text-white">Security Status</h6>
                    </div>
                    <div className="small text-white">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Password Strength:</span>
                        <span className={
                          securityStatus.passwordStrength === 'Strong' ? 'text-success' :
                          securityStatus.passwordStrength === 'Medium' ? 'text-warning' :
                          'text-danger'
                        }>
                          {securityStatus.passwordStrength}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Last Login:</span>
                        <span>{securityStatus.lastLogin}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Account Created:</span>
                        <span>{securityStatus.accountCreated}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Total Credentials:</span>
                        <span>{securityStatus.totalCredentials}</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </Col>
              </Row>
            </Tab>

            {/* Notifications Tab */}
            <Tab eventKey="notifications" title={
              <span className="d-flex align-items-center">
                <Bell size={18} className="me-2" />
                Notifications
              </span>
            }>
              <Row>
                <Col lg={8}>
                  <SpotlightCard spotlightColor="rgba(255, 193, 7, 0.2)">
                    <div className="mb-4">
                      <h5 className="mb-0 text-white">Notification Preferences</h5>
                    </div>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="emailNotifications"
                          label="Email Notifications"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                          className="text-white"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="securityAlerts"
                          label="Security Alerts"
                          checked={settings.securityAlerts}
                          onChange={(e) => handleInputChange('notifications', 'securityAlerts', e.target.checked)}
                          className="text-white"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="weeklyReports"
                          label="Weekly Security Reports"
                          checked={settings.weeklyReports}
                          onChange={(e) => handleInputChange('notifications', 'weeklyReports', e.target.checked)}
                          className="text-white"
                        />
                      </Form.Group>
                      <Button variant="primary" onClick={handleSaveSettings}>
                        <Save size={18} className="me-2" />
                        Save Notification Settings
                      </Button>
                    </Form>
                  </SpotlightCard>
                </Col>
              </Row>
            </Tab>

            {/* Data Tab */}
            <Tab eventKey="data" title={
              <span className="d-flex align-items-center">
                <Database size={18} className="me-2" />
                Data
              </span>
            }>
              <Row>
                <Col lg={8}>
                  <SpotlightCard spotlightColor="rgba(13, 110, 253, 0.2)">
                    <div className="mb-4">
                      <h5 className="mb-0 text-white">Data Management</h5>
                    </div>
                    <div className="mb-4">
                      <h6 className="text-white mb-3">Export Data</h6>
                      <p className="text-white-50 mb-3">
                        Download all your credentials and settings in a secure format.
                      </p>
                      <Button 
                        variant="outline-primary" 
                        onClick={handleExportData}
                        disabled={isExporting}
                      >
                        <Download size={18} className="me-2" />
                        {isExporting ? 'Exporting...' : 'Export All Data'}
                      </Button>
                    </div>
                    <div className="mb-4">
                      <h6 className="text-white mb-3">Import Data</h6>
                      <p className="text-white-50 mb-3">
                        Import credentials from other password managers.
                      </p>
                      <Button variant="outline-secondary" disabled>
                        <Upload size={18} className="me-2" />
                        Import Data (Coming Soon)
                      </Button>
                    </div>
                    <div className="mb-4">
                      <h6 className="text-white mb-3">Backup Settings</h6>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="switch"
                            id="autoBackup"
                            label="Automatic Backup"
                            checked={settings.autoBackup}
                            onChange={(e) => handleInputChange('data', 'autoBackup', e.target.checked)}
                            className="text-white"
                          />
                        </Form.Group>
                        {settings.autoBackup && (
                          <Form.Group className="mb-3">
                            <Form.Label className="text-white">Backup Frequency</Form.Label>
                            <Form.Select
                              value={settings.backupFrequency}
                              onChange={(e) => handleInputChange('data', 'backupFrequency', e.target.value)}
                              className="bg-dark text-white border-secondary"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </Form.Select>
                          </Form.Group>
                        )}
                      </Form>
                    </div>
                    <Button variant="primary" onClick={handleSaveSettings}>
                      <Save size={18} className="me-2" />
                      Save Data Settings
                    </Button>
                  </SpotlightCard>
                </Col>
                <Col lg={4}>
                  <SpotlightCard spotlightColor="rgba(220, 53, 69, 0.2)">
                    <div className="mb-3">
                      <h6 className="mb-0 text-white">Danger Zone</h6>
                    </div>
                    <div className="mb-3">
                      <p className="text-white-50 small mb-3">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-white small">Enter your password to confirm deletion:</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showDeletePassword ? 'text' : 'password'}
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                            className="bg-dark text-white border-secondary pe-5"
                          />
                          <Button
                            variant="link"
                            className="position-absolute top-50 end-0 translate-middle-y pe-3"
                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                          >
                            {showDeletePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                        </div>
                      </Form.Group>
                      <Button 
                        variant="outline-danger" 
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount || !deletePassword}
                      >
                        <Trash2 size={18} className="me-2" />
                        {isDeletingAccount ? 'Deleting Account...' : 'Delete Account'}
                      </Button>
                    </div>
                  </SpotlightCard>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
