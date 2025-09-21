import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseStorageService } from '../services/firebaseStorage';
import { Credential } from '../types';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { PasswordGenerator } from '../utils/passwordGenerator';

interface AddCredentialModalProps {
  show: boolean;
  onHide: () => void;
}

const AddCredentialModal: React.FC<AddCredentialModalProps> = ({ show, onHide }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    website: '',
    username: '',
    password: '',
    notes: '',
    category: 'Other',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Social Media',
    'Email',
    'Banking',
    'Shopping',
    'Work',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePassword = () => {
    const options = PasswordGenerator.getDefaultOptions();
    const generatedPassword = PasswordGenerator.generatePassword(options);
    setFormData({
      ...formData,
      password: generatedPassword,
    });
  };

  const formatWebsiteUrl = (url: string): string | undefined => {
    if (!url.trim()) return undefined;
    
    let formattedUrl = url.trim();
    
    // Add https:// if no protocol is specified
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    return formattedUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!formData.title.trim() || !formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const newCredential: Credential = {
        id: '', // Empty ID for new credentials - Firestore will generate one
        userId: user.id,
        title: formData.title.trim(),
        website: formatWebsiteUrl(formData.website),
        username: formData.username.trim(),
        password: formData.password,
        notes: formData.notes.trim() || undefined,
        category: formData.category,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
      };

      console.log('Saving credential with ID:', newCredential.id);
      console.log('Full credential object:', newCredential);
      await FirebaseStorageService.saveCredential(newCredential);
      
      // Reset form
      setFormData({
        title: '',
        website: '',
        username: '',
        password: '',
        notes: '',
        category: 'Other',
      });
      
      onHide();
    } catch (err) {
      console.error('Error saving credential:', err);
      setError(`Failed to save credential: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      website: '',
      username: '',
      password: '',
      notes: '',
      category: 'Other',
    });
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Credential</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g., Gmail Account"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="text"
                  name="website"
                  placeholder="example.com or https://example.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Username/Email *</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="username or email"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="me-2"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    className="me-2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={generatePassword}
                    title="Generate Password"
                  >
                    <RefreshCw size={16} />
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              placeholder="Additional notes (optional)"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Credential'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCredentialModal;
