import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseStorageService } from '../services/firebaseStorage';
import { Credential } from '../types';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { PasswordGenerator } from '../utils/passwordGenerator';

interface EditCredentialModalProps {
  show: boolean;
  onHide: () => void;
  credential: Credential | null;
  onUpdate: () => void;
}

const EditCredentialModal: React.FC<EditCredentialModalProps> = ({ 
  show, 
  onHide, 
  credential, 
  onUpdate 
}) => {
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

  // Update form data when credential changes
  useEffect(() => {
    if (credential) {
      setFormData({
        title: credential.title || '',
        website: credential.website || '',
        username: credential.username || '',
        password: credential.password || '',
        notes: credential.notes || '',
        category: credential.category || 'Other',
      });
    }
  }, [credential]);

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
    if (!user || !credential) return;

    setError('');
    setIsLoading(true);

    try {
      const updatedCredential: Credential = {
        ...credential,
        title: formData.title.trim(),
        website: formatWebsiteUrl(formData.website),
        username: formData.username.trim(),
        password: formData.password,
        notes: formData.notes.trim() || undefined,
        category: formData.category,
        updatedAt: new Date(),
      };

      await FirebaseStorageService.saveCredential(updatedCredential);
      onUpdate();
      onHide();
    } catch (error) {
      console.error('Error updating credential:', error);
      setError('Failed to update credential. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setFormData({
      title: '',
      website: '',
      username: '',
      password: '',
      notes: '',
      category: 'Other',
    });
    onHide();
  };

  if (!credential) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Edit Credential</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Gmail Account"
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-dark text-white border-secondary"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Website URL</Form.Label>
            <Form.Control
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="example.com or https://example.com"
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Username/Email *</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username@example.com"
                  required
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="bg-dark text-white border-secondary pe-5"
                  />
                  <div className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex gap-1">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-0 text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={generatePassword}
                      className="p-0 text-white"
                      title="Generate Password"
                    >
                      <RefreshCw size={16} />
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes (optional)"
              rows={3}
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Credential'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCredentialModal;
