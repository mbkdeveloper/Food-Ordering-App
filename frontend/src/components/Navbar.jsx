import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Utensils, ShoppingCart } from 'lucide-react';

const NavbarComponent = () => {
    const { user, logout, getTotalItems } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold text-danger">
                    <Utensils className="me-2" />
                    TunisiaFood
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            <div className="d-flex align-items-center">
                                {user.role === 'client' && (
                                    <Button variant="link" as={Link} to="/cart" className="text-dark position-relative me-3 p-0">
                                        <ShoppingCart size={24} />
                                        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle" style={{fontSize: '0.65rem'}}>
                                            {getTotalItems()}
                                        </Badge>
                                    </Button>
                                )}
                                {user.role === 'client' && (
                                    <Nav.Link as={Link} to="/myorders" className="me-3 fw-semibold">My Orders</Nav.Link>
                                )}
                                <span className="me-3 text-muted">Hello, {user.name || 'User'}</span>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                            </div>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button as={Link} to="/register" variant="danger" size="sm" className="ms-2">Sign Up</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
