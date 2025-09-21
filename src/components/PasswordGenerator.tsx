import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { PasswordGenerator as PasswordGen, PasswordGeneratorOptions } from '../utils/passwordGenerator';
import { Copy, RefreshCw, Check } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

const PasswordGenerator: React.FC = () => {
  const [options, setOptions] = useState<PasswordGeneratorOptions>(PasswordGen.getDefaultOptions());
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    try {
      const password = PasswordGen.generatePassword(options);
      setGeneratedPassword(password);
      setCopied(false);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleOptionChange = (key: keyof PasswordGeneratorOptions, value: boolean | number) => {
    setOptions((prev: PasswordGeneratorOptions) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getPasswordStrength = () => {
    if (!generatedPassword) return { score: 0, color: '#6c757d' };
    
    let score = 0;
    if (generatedPassword.length >= 8) score++;
    if (generatedPassword.length >= 12) score++;
    if (/[a-z]/.test(generatedPassword)) score++;
    if (/[A-Z]/.test(generatedPassword)) score++;
    if (/[0-9]/.test(generatedPassword)) score++;
    if (/[^A-Za-z0-9]/.test(generatedPassword)) score++;

    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#198754'];
    return {
      score: Math.min(score, 5),
      color: colors[Math.min(score, 4)] || '#6c757d'
    };
  };

  const strength = getPasswordStrength();

  return (
    <Row>
      <Col lg={8}>
        <SpotlightCard spotlightColor="rgba(13, 110, 253, 0.2)">
          <div className="mb-4">
            <h5 className="mb-0 text-white">Password Generator</h5>
          </div>
          <div>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white fw-semibold">Password Length: {options.length}</Form.Label>
                    <Form.Range
                      min={4}
                      max={50}
                      value={options.length}
                      onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                    />
                    <div className="d-flex justify-content-between text-light small">
                      <span>4</span>
                      <span>50</span>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Form.Label className="text-white fw-semibold">Character Types</Form.Label>
                    <div className="d-grid gap-2">
                      <Form.Check
                        type="checkbox"
                        id="includeUppercase"
                        label="Uppercase letters (A-Z)"
                        checked={options.includeUppercase}
                        onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
                        className="text-white"
                      />
                      <Form.Check
                        type="checkbox"
                        id="includeLowercase"
                        label="Lowercase letters (a-z)"
                        checked={options.includeLowercase}
                        onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
                        className="text-white"
                      />
                      <Form.Check
                        type="checkbox"
                        id="includeNumbers"
                        label="Numbers (0-9)"
                        checked={options.includeNumbers}
                        onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
                        className="text-white"
                      />
                      <Form.Check
                        type="checkbox"
                        id="includeSymbols"
                        label="Symbols (!@#$%^&*)"
                        checked={options.includeSymbols}
                        onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
                        className="text-white"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Form.Label className="text-white fw-semibold">Exclusions</Form.Label>
                    <div className="d-grid gap-2">
                      <Form.Check
                        type="checkbox"
                        id="excludeSimilar"
                        label="Exclude similar characters (il1Lo0O)"
                        checked={options.excludeSimilar}
                        onChange={(e) => handleOptionChange('excludeSimilar', e.target.checked)}
                        className="text-white"
                      />
                      <Form.Check
                        type="checkbox"
                        id="excludeAmbiguous"
                        label="Exclude ambiguous characters ({}[]()/\\)"
                        checked={options.excludeAmbiguous}
                        onChange={(e) => handleOptionChange('excludeAmbiguous', e.target.checked)}
                        className="text-white"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="d-grid">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={generatePassword}
                  className="d-flex align-items-center justify-content-center"
                >
                  <RefreshCw size={18} className="me-2" />
                  Generate Password
                </Button>
              </div>
            </Form>
          </div>
        </SpotlightCard>
      </Col>

      <Col lg={4}>
        <SpotlightCard spotlightColor="rgba(40, 167, 69, 0.2)" className="mb-3">
          <div className="mb-3">
            <h6 className="mb-0 text-white">Generated Password</h6>
          </div>
          <div>
            {generatedPassword ? (
              <>
                <div className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={generatedPassword}
                      readOnly
                      className="font-monospace"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={copyToClipboard}
                      disabled={copied}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                  </InputGroup>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">Strength</small>
                    <small className="fw-semibold" style={{ color: strength.color }}>
                      {strength.score === 0 && 'Very Weak'}
                      {strength.score === 1 && 'Weak'}
                      {strength.score === 2 && 'Fair'}
                      {strength.score === 3 && 'Good'}
                      {strength.score === 4 && 'Strong'}
                      {strength.score === 5 && 'Very Strong'}
                    </small>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(strength.score / 5) * 100}%`,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                </div>

                <div className="text-muted small">
                  <div>Length: {generatedPassword.length} characters</div>
                  <div>Entropy: ~{Math.log2(Math.pow(26, generatedPassword.length)).toFixed(0)} bits</div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted py-4">
                <RefreshCw size={32} className="mb-2 opacity-50" />
                <p>Click "Generate Password" to create a new password</p>
              </div>
            )}
          </div>
        </SpotlightCard>

        <SpotlightCard spotlightColor="rgba(255, 193, 7, 0.2)">
          <div className="mb-3">
            <h6 className="mb-0 text-white">Tips</h6>
          </div>
          <div>
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">• Use at least 12 characters for better security</li>
              <li className="mb-2">• Include a mix of character types</li>
              <li className="mb-2">• Avoid common patterns and words</li>
              <li className="mb-2">• Use unique passwords for each account</li>
              <li>• Consider using a password manager to store them securely</li>
            </ul>
          </div>
        </SpotlightCard>
      </Col>
    </Row>
  );
};

export default PasswordGenerator;
