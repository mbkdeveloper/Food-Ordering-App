import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3002/api/user/login', { email, password });
            if (res.data.success) {
                login(res.data.token);
                if (res.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '400px' }} className="shadow-sm border-0">
                <Card.Body className="p-4">
                    <h3 className="text-center mb-4 fw-bold">Welcome Back</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                        <Button variant="danger" type="submit" className="w-100 mb-3">
                            Login
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/register" className="text-danger text-decoration-none">Sign up</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
