import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Badge, Dropdown, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseStorageService } from '../services/firebaseStorage';
import { Credential } from '../types';
import { Eye, EyeOff, Edit, Trash2, Star, Copy, ExternalLink, MoreVertical } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import EditCredentialModal from './EditCredentialModal';

interface CredentialListProps {
  searchQuery: string;
  showFavoritesOnly?: boolean;
}

const CredentialList: React.FC<CredentialListProps> = ({ searchQuery, showFavoritesOnly = false }) => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState<Credential | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadCredentials = useCallback(() => {
    if (!user) return;
    
    const unsubscribe = FirebaseStorageService.subscribeToCredentials(user.id, (credentials) => {
      console.log('Received credentials from Firebase:', credentials);
      setCredentials(credentials);
    });

    return unsubscribe;
  }, [user]);

  const filterCredentials = useCallback(async () => {
    if (!user) return;
    
    console.log('Filtering credentials:', { credentials, searchQuery, showFavoritesOnly });
    
    let filtered = credentials;
    
    if (searchQuery) {
      try {
        filtered = await FirebaseStorageService.searchCredentials(user.id, searchQuery);
      } catch (error) {
        console.error('Search error:', error);
        filtered = credentials;
      }
    }
    
    if (showFavoritesOnly) {
      filtered = filtered.filter(cred => cred.isFavorite);
    }
    
    console.log('Filtered credentials:', filtered);
    setFilteredCredentials(filtered);
  }, [credentials, searchQuery, user, showFavoritesOnly]);

  useEffect(() => {
    console.log('CredentialList useEffect - user:', user);
    if (user) {
      console.log('Loading credentials for user:', user.id);
      const unsubscribe = loadCredentials();
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [user, loadCredentials]);

  useEffect(() => {
    filterCredentials();
  }, [filterCredentials]);

  const togglePasswordVisibility = (credentialId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setAlert({ type: 'success', message: `${type} copied to clipboard!` });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to copy to clipboard' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const toggleFavorite = async (credential: Credential) => {
    try {
      const updatedCredential = {
        ...credential,
        isFavorite: !credential.isFavorite,
        updatedAt: new Date(),
      };
      
      await FirebaseStorageService.saveCredential(updatedCredential);
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error updating favorite status:', error);
      setAlert({ type: 'error', message: 'Failed to update favorite status' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleEdit = (credential: Credential) => {
    setEditingCredential(credential);
    setShowEditModal(true);
  };

  const handleDelete = (credential: Credential) => {
    setCredentialToDelete(credential);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (credentialToDelete) {
      try {
        await FirebaseStorageService.deleteCredential(credentialToDelete.id);
        setShowDeleteModal(false);
        setCredentialToDelete(null);
        setAlert({ type: 'success', message: 'Credential deleted successfully!' });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        console.error('Error deleting credential:', error);
        setAlert({ type: 'error', message: 'Failed to delete credential' });
        setTimeout(() => setAlert(null), 3000);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Social Media': 'primary',
      'Email': 'info',
      'Banking': 'danger',
      'Shopping': 'success',
      'Work': 'warning',
      'Other': 'secondary',
    };
    return colors[category] || 'secondary';
  };

  if (filteredCredentials.length === 0) {
    return (
      <SpotlightCard spotlightColor="rgba(13, 110, 253, 0.2)">
        <div className="text-center py-5">
          <div className="text-white-50">
            <h5 className="text-white">No credentials found</h5>
            <p>
              {showFavoritesOnly 
                ? "You don't have any favorite credentials yet."
                : searchQuery 
                  ? "No credentials match your search."
                  : "Start by adding your first credential."
              }
            </p>
          </div>
        </div>
      </SpotlightCard>
    );
  }

  return (
    <>
      {alert && (
        <Alert variant={alert.type === 'success' ? 'success' : 'danger'} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Row>
        {filteredCredentials.map((credential) => (
          <Col key={credential.id} md={6} lg={4} className="mb-4">
            <SpotlightCard className="h-100" spotlightColor="rgba(13, 110, 253, 0.2)">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <h6 className="card-title mb-1 text-white fw-bold">{credential.title}</h6>
                    {credential.website && (
                      <small className="text-light d-flex align-items-center">
                        <ExternalLink size={12} className="me-1" />
                        {credential.website}
                      </small>
                    )}
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle variant="link" className="p-0 text-light">
                      <MoreVertical size={16} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEdit(credential)}>
                        <Edit size={14} className="me-2" />
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => toggleFavorite(credential)}>
                        <Star size={14} className="me-2" />
                        {credential.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        onClick={() => handleDelete(credential)}
                        className="text-danger"
                      >
                        <Trash2 size={14} className="me-2" />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <small className="text-light me-2 fw-semibold">Username:</small>
                    <code className="flex-grow-1 me-2 text-white bg-dark px-2 py-1 rounded">{credential.username}</code>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => copyToClipboard(credential.username, 'Username')}
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <small className="text-light me-2 fw-semibold">Password:</small>
                    <code className="flex-grow-1 me-2 text-white bg-dark px-2 py-1 rounded">
                      {showPassword[credential.id] ? credential.password : '••••••••'}
                    </code>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => togglePasswordVisibility(credential.id)}
                      className="me-1"
                    >
                      {showPassword[credential.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                    </Button>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => copyToClipboard(credential.password, 'Password')}
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg={getCategoryColor(credential.category)}>
                    {credential.category}
                  </Badge>
                  {credential.isFavorite && (
                    <Star size={16} className="text-warning" fill="currentColor" />
                  )}
                </div>

                {credential.notes && (
                  <div className="mt-2">
                    <small className="text-muted">{credential.notes}</small>
                  </div>
                )}
              </div>
            </SpotlightCard>
          </Col>
        ))}
      </Row>

      {/* Edit Modal */}
      <EditCredentialModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        credential={editingCredential}
        onUpdate={loadCredentials}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Credential</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this credential?</p>
          <p className="text-muted">
            <strong>{credentialToDelete?.title}</strong> - {credentialToDelete?.username}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CredentialList;
