import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, ProgressBar } from 'react-bootstrap';
import { PasswordChecker as PwdChecker } from '../utils/passwordChecker';
import { Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<ReturnType<typeof PwdChecker.checkStrength> | null>(null);

  const checkPassword = () => {
    if (password.trim()) {
      const result = PwdChecker.checkStrength(password);
      setStrength(result);
    } else {
      setStrength(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Auto-check as user types
    if (newPassword.trim()) {
      const result = PwdChecker.checkStrength(newPassword);
      setStrength(result);
    } else {
      setStrength(null);
    }
  };

  const getStrengthIcon = (score: number) => {
    if (score >= 4) return <CheckCircle size={20} className="text-success" />;
    if (score >= 2) return <AlertTriangle size={20} className="text-warning" />;
    return <XCircle size={20} className="text-danger" />;
  };

  const getStrengthColor = (score: number) => {
    return PwdChecker.getStrengthColor(score);
  };

  return (
    <Row>
      <Col lg={8}>
        <SpotlightCard spotlightColor="rgba(13, 110, 253, 0.2)">
          <div className="mb-4">
            <h5 className="mb-0 text-white">Password Strength Checker</h5>
          </div>
          <div>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold text-white">Enter Password to Check</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pe-5"
                  />
                  <Button
                    variant="link"
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  onClick={checkPassword}
                  disabled={!password.trim()}
                >
                  Check Password Strength
                </Button>
              </div>
            </Form>
          </div>
        </SpotlightCard>

        {strength && (
          <SpotlightCard spotlightColor="rgba(40, 167, 69, 0.2)" className="mt-4">
            <div className="mb-4">
              <div className="d-flex align-items-center">
                {getStrengthIcon(strength.score)}
                <span className="ms-2 fw-semibold text-white">Password Analysis</span>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold text-white">Strength Level</span>
                  <span 
                    className="fw-bold text-white"
                    style={{ color: getStrengthColor(strength.score) }}
                  >
                    {strength.feedback}
                  </span>
                </div>
                <ProgressBar
                  now={(strength.score / 5) * 100}
                  style={{
                    height: '8px',
                    backgroundColor: '#e9ecef',
                  }}
                >
                  <ProgressBar
                    style={{
                      backgroundColor: getStrengthColor(strength.score),
                    }}
                  />
                </ProgressBar>
              </div>

              <div className="mb-3">
                <h6 className="mb-2 text-white">Security Assessment</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">
                        {password.length >= 8 ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <XCircle size={16} className="text-danger" />
                        )}
                      </span>
                      <small className="text-white">At least 8 characters</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">
                        {password.length >= 12 ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <XCircle size={16} className="text-danger" />
                        )}
                      </span>
                      <small className="text-white">At least 12 characters (recommended)</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">
                        {/[a-z]/.test(password) ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <XCircle size={16} className="text-danger" />
                        )}
                      </span>
                      <small className="text-white">Contains lowercase letters</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">
                        {/[A-Z]/.test(password) ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <XCircle size={16} className="text-danger" />
                        )}
                      </span>
                      <small className="text-white">Contains uppercase letters</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">
                        {/[0-9]/.test(password) ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <XCircle size={16} className="text-danger" />
                        )}
                      </span>
                      <small className="text-white">Contains numbers</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="me-2">
                        {/[^A-Za-z0-9]/.test(password) ? (
                          <CheckCircle size={16} className="text-success" />
                        ) : (
                          <XCircle size={16} className="text-danger" />
                        )}
                      </span>
                      <small className="text-white">Contains special characters</small>
                    </div>
                  </div>
                </div>
              </div>

              {strength.suggestions.length > 0 && (
                <div className="mb-3">
                  <h6 className="mb-2 text-white">Suggestions for Improvement</h6>
                  <ul className="list-unstyled mb-0">
                    {strength.suggestions.map((suggestion, index) => (
                      <li key={index} className="mb-1">
                        <small className="text-white">• {suggestion}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Alert variant={strength.isStrong ? 'success' : 'warning'} className="mb-0">
                <div className="d-flex align-items-center">
                  {strength.isStrong ? (
                    <CheckCircle size={20} className="me-2" />
                  ) : (
                    <AlertTriangle size={20} className="me-2" />
                  )}
                  <div>
                    <strong>
                      {strength.isStrong ? 'Good job!' : 'Password needs improvement'}
                    </strong>
                    <div 
                      className={`small ${!strength.isStrong ? 'text-danger' : ''}`}
                      style={{ color: strength.isStrong ? 'inherit' : '#dc3545', fontWeight: '500' }}
                    >
                      {strength.isStrong 
                        ? 'Your password meets security requirements.'
                        : 'Consider following the suggestions above to strengthen your password.'
                      }
                    </div>
                  </div>
                </div>
              </Alert>
            </div>
          </SpotlightCard>
        )}
      </Col>

      <Col lg={4}>
        <SpotlightCard spotlightColor="rgba(255, 193, 7, 0.2)" className="mb-3">
          <div className="mb-3">
            <h6 className="mb-0 text-white">Password Security Tips</h6>
          </div>
          <div>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-3">
                <strong>Length Matters:</strong> Use at least 12 characters for better security.
              </li>
              <li className="mb-3">
                <strong>Mix It Up:</strong> Include uppercase, lowercase, numbers, and symbols.
              </li>
              <li className="mb-3">
                <strong>Avoid Patterns:</strong> Don't use sequential characters or common patterns.
              </li>
              <li className="mb-3">
                <strong>No Personal Info:</strong> Avoid using names, birthdays, or personal details.
              </li>
              <li className="mb-3">
                <strong>Unique Passwords:</strong> Use different passwords for each account.
              </li>
              <li className="mb-3">
                <strong>Regular Updates:</strong> Change passwords periodically, especially for important accounts.
              </li>
              <li>
                <strong>Password Manager:</strong> Consider using a password manager to generate and store strong passwords.
              </li>
            </ul>
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(220, 53, 69, 0.2)">
          <div className="mb-3">
            <h6 className="mb-0 text-white">Common Weak Passwords</h6>
          </div>
          <div>
            <div className="small text-muted">
              <p className="mb-2">Avoid these common weak passwords:</p>
              <ul className="list-unstyled mb-0">
                <li>• password, 123456, qwerty</li>
                <li>• abc123, password123</li>
                <li>• admin, letmein, welcome</li>
                <li>• Your name or username</li>
                <li>• Birthdays or anniversaries</li>
                <li>• Dictionary words</li>
              </ul>
            </div>
          </div>
        </SpotlightCard>
      </Col>
    </Row>
  );
};

export default PasswordChecker;
