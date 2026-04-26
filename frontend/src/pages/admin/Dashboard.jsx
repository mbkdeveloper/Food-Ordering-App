import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Button, Card, Spinner } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Utensils, LayoutDashboard, PlusCircle, List, Users, Package, DollarSign } from 'lucide-react';
import axios from 'axios';
import ListFoods from './ListFoods';
import AddFood from './AddFood';
import ManageOrders from './ManageOrders';
import ManageUsers from './ManageUsers';

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const DashboardStats = () => {
        const { token } = useContext(AuthContext);
        const [stats, setStats] = useState(null);

        useEffect(() => {
            const fetchStats = async () => {
                try {
                    const res = await axios.get('http://localhost:3002/api/user/stats', { headers: { token } });
                    if (res.data.success) {
                        setStats(res.data.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch stats");
                }
            };
            if (token) fetchStats();
        }, [token]);

        if (!stats) return <Spinner animation="border" variant="danger" />;

        return (
            <div>
                <h2 className="fw-bold mb-4">Dashboard Overview</h2>
                <Row className="g-4">
                    <Col md={3}>
                        <Card className="border-0 shadow-sm text-center p-3">
                            <Card.Body>
                                <DollarSign size={40} className="text-success mb-2" />
                                <h5>Revenue</h5>
                                <h3 className="fw-bold">{stats.revenue} TND</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm text-center p-3">
                            <Card.Body>
                                <Package size={40} className="text-primary mb-2" />
                                <h5>Orders</h5>
                                <h3 className="fw-bold">{stats.orders}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm text-center p-3">
                            <Card.Body>
                                <Users size={40} className="text-info mb-2" />
                                <h5>Users</h5>
                                <h3 className="fw-bold">{stats.users}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0 shadow-sm text-center p-3">
                            <Card.Body>
                                <Utensils size={40} className="text-warning mb-2" />
                                <h5>Menu Items</h5>
                                <h3 className="fw-bold">{stats.foods}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    return (
        <div className="d-flex flex-column vh-100 bg-light">
            {/* Admin Top Navbar */}
            <Navbar bg="dark" variant="dark" className="px-4 shadow-sm py-3">
                <Navbar.Brand className="d-flex align-items-center fw-bold">
                    <Utensils className="me-2 text-danger" />
                    TunisiaFood Admin
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                </Navbar.Collapse>
            </Navbar>

            <Row className="flex-grow-1 mx-0 overflow-hidden">
                {/* Sidebar */}
                <Col md={2} className="bg-white border-end pt-4 px-0">
                    <Nav className="flex-column">
                        <Nav.Link 
                            as={Link} 
                            to="/admin" 
                            className={`px-4 py-3 text-dark d-flex align-items-center ${location.pathname === '/admin' ? 'bg-light border-start border-danger border-4 fw-bold' : ''}`}>
                            <LayoutDashboard className="me-3" size={20} />
                            Dashboard
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/admin/add"
                            className={`px-4 py-3 text-dark d-flex align-items-center ${location.pathname === '/admin/add' ? 'bg-light border-start border-danger border-4 fw-bold' : ''}`}>
                            <PlusCircle className="me-3" size={20} />
                            Add Food
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/admin/list"
                            className={`px-4 py-3 text-dark d-flex align-items-center ${location.pathname === '/admin/list' ? 'bg-light border-start border-danger border-4 fw-bold' : ''}`}>
                            <List className="me-3" size={20} />
                            List Foods
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/admin/orders"
                            className={`px-4 py-3 text-dark d-flex align-items-center ${location.pathname === '/admin/orders' ? 'bg-light border-start border-danger border-4 fw-bold' : ''}`}>
                            <Package className="me-3" size={20} />
                            Orders
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/admin/users"
                            className={`px-4 py-3 text-dark d-flex align-items-center ${location.pathname === '/admin/users' ? 'bg-light border-start border-danger border-4 fw-bold' : ''}`}>
                            <Users className="me-3" size={20} />
                            Users
                        </Nav.Link>
                    </Nav>
                </Col>

                {/* Main Content Area */}
                <Col md={10} className="p-4 overflow-auto">
                    <Routes>
                        <Route path="/" element={<DashboardStats />} />
                        <Route path="/add" element={<AddFood />} />
                        <Route path="/list" element={<ListFoods />} />
                        <Route path="/orders" element={<ManageOrders />} />
                        <Route path="/users" element={<ManageUsers />} />
                    </Routes>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
