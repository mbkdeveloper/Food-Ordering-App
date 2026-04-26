import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount } = useContext(AuthContext);
    const navigate = useNavigate();
    const totalAmount = getTotalCartAmount();
    const deliveryFee = totalAmount === 0 ? 0 : 2;

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    useEffect(() => {
        if (totalAmount === 0) {
            navigate('/cart');
        }
    }, [totalAmount, navigate]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const proceedToPayment = (e) => {
        e.preventDefault();
        // Pass delivery data to the payment page via state
        navigate('/payment', { state: { deliveryData: data } });
    }

    return (
        <Container className="py-5">
            <Form onSubmit={proceedToPayment}>
                <Row>
                    <Col lg={8} className="mb-4">
                        <h3 className="fw-bold mb-4">Delivery Information</h3>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Control required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
                            </Col>
                            <Col md={6}>
                                <Form.Control required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" />
                            </Col>
                            <Col md={6}>
                                <Form.Control required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
                            </Col>
                            <Col md={6}>
                                <Form.Control required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone number" />
                            </Col>
                            <Col md={12}>
                                <Form.Control required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder="Street address" />
                            </Col>
                            <Col md={6}>
                                <Form.Control required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
                            </Col>
                            <Col md={6}>
                                <Form.Control required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
                            </Col>
                            <Col md={6}>
                                <Form.Control required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
                            </Col>
                            <Col md={6}>
                                <Form.Control required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-4">Cart Totals</h5>
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Subtotal</span>
                                    <span>{totalAmount} TND</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>Delivery Fee</span>
                                    <span>{deliveryFee} TND</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold">Total</span>
                                    <span className="fw-bold text-danger">{totalAmount + deliveryFee} TND</span>
                                </div>
                                <Button 
                                    variant="danger" 
                                    type="submit"
                                    className="w-100" 
                                >
                                    PROCEED TO PAYMENT
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default PlaceOrder;
