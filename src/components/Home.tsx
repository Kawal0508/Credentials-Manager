import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Key, 
  Search, 
  Star, 
  Plus, 
  Eye,
  Lock,
  Database,
  Smartphone,
  Globe
} from 'lucide-react';
import DarkVeil from './DarkVeil';

interface HomeProps {
  onNavigate: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Shield className="text-primary" size={48} />,
      title: "Secure Storage",
      description: "Your credentials are encrypted and stored safely in the cloud",
      action: "View Credentials",
      onClick: () => onNavigate('credentials')
    },
    {
      icon: <Key className="text-success" size={48} />,
      title: "Password Generator",
      description: "Create strong, unique passwords with customizable options",
      action: "Generate Password",
      onClick: () => onNavigate('generator')
    },
    {
      icon: <Search className="text-info" size={48} />,
      title: "Password Checker",
      description: "Check the strength and security of your current passwords",
      action: "Check Password",
      onClick: () => onNavigate('checker')
    }
  ];

  const stats = [
    { icon: <Database className="text-primary" size={24} />, label: "Cloud Storage", value: "Firebase" },
    { icon: <Lock className="text-success" size={24} />, label: "Encryption", value: "AES-256" },
    { icon: <Smartphone className="text-info" size={24} />, label: "Cross-Device", value: "Sync" },
    { icon: <Globe className="text-warning" size={24} />, label: "Real-time", value: "Updates" }
  ];

  return (
    <div className="home-page">
      {/* DarkVeil Background */}
      <div className="darkveil-background">
        <DarkVeil 
          hueShift={120}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          speed={0.3}
          scanlineFrequency={2.0}
          warpAmount={0.1}
          resolutionScale={1}
        />
      </div>
      
      {/* Hero Section */}
      <div className="hero-section text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">
                Welcome back, {user?.username || 'User'}! 👋
              </h1>
              <p className="lead mb-4">
                Manage your credentials securely with our advanced password manager.
                Your digital life is safe with us.
              </p>
              <div className="d-flex gap-3">
                <Button 
                  variant="light" 
                  size="lg" 
                  onClick={() => onNavigate('credentials')}
                  className="d-flex align-items-center gap-2"
                >
                  <Eye size={20} />
                  View My Credentials
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => onNavigate('credentials')}
                  className="d-flex align-items-center gap-2"
                >
                  <Plus size={20} />
                  Add New Credential
                </Button>
              </div>
            </Col>
            <Col lg={4} className="text-center">
              <div className="hero-icon">
                <img 
                  src="/animate_logo.svg" 
                  alt="Credentials Manager Logo" 
                  style={{ width: '200px', height: '200px', opacity: 0.75 }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="mb-5">
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="display-5 fw-bold mb-3">What You Can Do</h2>
            <p className="lead text-muted">
              Powerful features to keep your digital life secure and organized
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col lg={4} key={index}>
              <Card className="h-100 shadow-sm border-0 feature-card">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    {feature.icon}
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-4">{feature.description}</p>
                  <Button 
                    variant="outline-primary" 
                    onClick={feature.onClick}
                    className="w-100"
                  >
                    {feature.action}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Stats Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col className="mb-4">
              <h3 className="fw-bold mb-3">Your Security Features</h3>
              <p className="text-muted">Built with the latest security standards</p>
            </Col>
          </Row>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col md={3} key={index}>
                <div className="text-center">
                  <div className="mb-3">
                    {stat.icon}
                  </div>
                  <h5 className="fw-bold mb-1">{stat.value}</h5>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Quick Actions */}
      <Container className="py-5">
        <Row className="text-center">
          <Col>
            <h3 className="fw-bold mb-4">Quick Actions</h3>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => onNavigate('credentials')}
                className="d-flex align-items-center gap-2"
              >
                <Eye size={20} />
                View All Credentials
              </Button>
              <Button 
                variant="success" 
                size="lg"
                onClick={() => onNavigate('generator')}
                className="d-flex align-items-center gap-2"
              >
                <Key size={20} />
                Generate Password
              </Button>
              <Button 
                variant="info" 
                size="lg"
                onClick={() => onNavigate('checker')}
                className="d-flex align-items-center gap-2"
              >
                <Search size={20} />
                Check Password
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
