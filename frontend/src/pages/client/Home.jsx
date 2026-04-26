import React, { useContext } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
    const { foodList, addToCart, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddToCart = (id) => {
        if (!token) {
            localStorage.setItem('pendingCartItem', id);
            navigate('/login');
        } else {
            addToCart(id);
        }
    };

    if (foodList.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5 fw-bold text-dark">Discover Tunisian Cuisine</h2>
            <Row className="g-4">
                {foodList.map((food) => (
                    <Col key={food._id} xs={12} md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm food-card">
                            <Card.Img 
                                variant="top" 
                                src={food.image.startsWith('http') ? food.image : `http://localhost:3002/images/${food.image}`} 
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <Card.Title className="fw-bold mb-0">{food.name}</Card.Title>
                                    <Badge bg="danger" className="fs-6">{food.price} TND</Badge>
                                </div>
                                <Badge bg="light" text="dark" className="mb-3 align-self-start border">{food.category}</Badge>
                                <Card.Text className="text-muted flex-grow-1">
                                    {food.description}
                                </Card.Text>
                                <Button 
                                    variant="outline-danger" 
                                    className="mt-auto d-flex align-items-center justify-content-center"
                                    onClick={() => handleAddToCart(food._id)}
                                >
                                    <ShoppingCart size={18} className="me-2" />
                                    Add to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;
