import React, { useContext, useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Package } from 'lucide-react';

const MyOrders = () => {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.post("http://localhost:3002/api/order/userorders", {}, {
                headers: { token }
            });
            if (response.data.success) {
                setData(response.data.data.reverse()); // Show newest first
            }
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="fw-bold mb-4">My Orders</h2>
            {data.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <Package size={48} className="mb-3 opacity-50" />
                    <h5>You have no orders yet.</h5>
                </div>
            ) : (
                <Row className="g-4">
                    {data.map((order, index) => (
                        <Col xs={12} key={index}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                    <div className="d-flex align-items-start gap-3">
                                        <Package className="text-danger" size={32} />
                                        <div>
                                            <p className="mb-1 fw-semibold">
                                                {order.items.map((item, idx) => {
                                                    if (idx === order.items.length - 1) {
                                                        return item.name + " x " + item.quantity
                                                    } else {
                                                        return item.name + " x " + item.quantity + ", "
                                                    }
                                                })}
                                            </p>
                                            <span className="text-muted small">Order ID: {order._id.substring(order._id.length - 8)}</span>
                                        </div>
                                    </div>
                                    <div className="fw-bold fs-5">
                                        {order.amount}.00 TND
                                    </div>
                                    <div className="text-muted">
                                        Items: {order.items.length}
                                    </div>
                                    <div>
                                        <Badge bg={order.status === 'Delivered' ? 'success' : 'warning'} text={order.status === 'Delivered' ? 'light' : 'dark'} className="p-2">
                                            &#x25cf; <b>{order.status}</b>
                                        </Badge>
                                    </div>
                                    <button onClick={fetchOrders} className="btn btn-outline-danger btn-sm px-4">
                                        Track Order
                                    </button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyOrders;
