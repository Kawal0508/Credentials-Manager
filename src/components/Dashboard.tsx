import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Home from './Home';
import CredentialList from './CredentialList';
import PasswordGenerator from './PasswordGenerator';
import PasswordChecker from './PasswordChecker';
import AddCredentialModal from './AddCredentialModal';
import SearchCredentials from './SearchCredentials';
import Settings from './Settings';
import PillNav from './PillNav';
import DarkVeil from './DarkVeil';
import SpotlightCard from './SpotlightCard';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (section: string) => {
    setActiveTab(section);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { label: 'Home', href: 'home' },
    { label: 'Credentials', href: 'credentials' },
    { label: 'Generator', href: 'generator' },
    { label: 'Checker', href: 'checker' },
    { label: 'Favorites', href: 'favorites' },
    { label: 'Settings', href: 'settings' }
  ];

  return (
    <div className="dashboard-page min-vh-100">
      {/* DarkVeil Background */}
      <div className="darkveil-background">
        <DarkVeil 
          hueShift={180}
          noiseIntensity={0.05}
          scanlineIntensity={0.3}
          speed={0.5}
          scanlineFrequency={3.0}
          warpAmount={0.2}
          resolutionScale={1}
        />
      </div>
      
      {/* Header with PillNav and User Controls */}
      <div className="dashboard-header px-4 py-3" style={{ marginTop: '1em' }}>
        {/* Mobile User Controls - Above Menu */}
        <div className="d-flex justify-content-between align-items-center d-md-none mb-3">
          <span className="text-white fw-semibold">Welcome, {user?.username}</span>
          <Button
            variant="outline-light"
            size="sm"
            onClick={handleLogout}
            className="d-flex align-items-center px-3 py-2"
            style={{ fontSize: '0.8rem' }}
          >
            <LogOut size={14} className="me-1" />
            Logout
          </Button>
        </div>
        
        {/* Desktop Layout */}
        <div className="d-none d-md-flex justify-content-between align-items-center">
          {/* PillNav */}
          <PillNav
            logo="/logo.svg"
            logoAlt="Credentials Manager"
            items={navItems}
            activeHref={activeTab}
            baseColor="transparent"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            onItemClick={handleTabChange}
          />
          
          {/* Desktop User Controls */}
          <div className="user-controls d-flex align-items-center gap-3">
            {activeTab === 'credentials' && (
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="d-flex align-items-center"
              >
                <Plus size={18} className="me-1" />
                Add Credential
              </Button>
            )}
            <span className="text-white fw-semibold">Welcome, {user?.username}</span>
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <LogOut size={16} className="me-1" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile PillNav - Below User Controls */}
        <div className="d-md-none mb-3">
          <PillNav
            logo="/logo.svg"
            logoAlt="Credentials Manager"
            items={navItems}
            activeHref={activeTab}
            baseColor="transparent"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            onItemClick={handleTabChange}
          />
        </div>
        
        {/* Mobile Add Button - Separate Row */}
        {activeTab === 'credentials' && (
          <div className="d-flex justify-content-center d-md-none">
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="d-flex align-items-center px-4 py-2"
              style={{ fontSize: '0.9rem' }}
            >
              <Plus size={18} className="me-2" />
              Add New Credential
            </Button>
          </div>
        )}
      </div>

      <Container fluid className="py-4">
        <Row>
          {/* Main Content */}
          <Col>
            <div className="mb-4">
              <h2 className="mb-0 text-white">
                {activeTab === 'home' && 'Dashboard'}
                {activeTab === 'credentials' && 'My Credentials'}
                {activeTab === 'generator' && 'Password Generator'}
                {activeTab === 'checker' && 'Password Checker'}
                {activeTab === 'favorites' && 'Favorite Credentials'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
            </div>

            {/* Search Bar for Credentials */}
            {activeTab === 'credentials' && (
              <div className="mb-4">
                <SearchCredentials
                  onSearch={setSearchQuery}
                  placeholder="Search credentials..."
                />
              </div>
            )}

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'home' && (
                <Home onNavigate={handleNavigate} />
              )}
              {activeTab === 'credentials' && (
                <CredentialList searchQuery={searchQuery} />
              )}
              {activeTab === 'generator' && <PasswordGenerator />}
              {activeTab === 'checker' && <PasswordChecker />}
              {activeTab === 'favorites' && (
                <CredentialList searchQuery="" showFavoritesOnly={true} />
              )}
              {activeTab === 'settings' && <Settings />}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Add Credential Modal */}
      <AddCredentialModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default Dashboard;
