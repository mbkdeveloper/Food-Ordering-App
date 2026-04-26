import React, { useContext, useEffect, useState } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Banknote } from 'lucide-react';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, foodList, cartItems, getTotalCartAmount, setCartItems } = useContext(AuthContext);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const deliveryData = location.state?.deliveryData;
    const totalAmount = getTotalCartAmount();
    const deliveryFee = totalAmount === 0 ? 0 : 2;

    useEffect(() => {
        if (!deliveryData || totalAmount === 0) {
            navigate('/cart');
        }
    }, [deliveryData, totalAmount, navigate]);

    const placeOrder = async () => {
        setLoading(true);
        setError('');
        try {
            let orderItems = [];
            foodList.forEach((item) => {
                if (cartItems[item._id] > 0) {
                    let itemInfo = { ...item };
                    itemInfo.quantity = cartItems[item._id];
                    orderItems.push(itemInfo);
                }
            });

            let orderData = {
                address: deliveryData,
                items: orderItems,
                amount: totalAmount + deliveryFee,
                paymentMethod: paymentMethod
            };

            const response = await axios.post("http://localhost:3002/api/order/place", orderData, {
                headers: { token }
            });

            if (response.data.success) {
                setCartItems({}); // Clear cart
                if (paymentMethod === 'COD') {
                    navigate('/myorders');
                } else if (response.data.session_url) {
                    // If Stripe is re-enabled later
                    window.location.replace(response.data.session_url);
                }
            } else {
                setError(response.data.message || "Error placing order");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!deliveryData) return null;

    return (
        <Container className="py-5 d-flex justify-content-center">
            <Card style={{ width: '500px' }} className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    <h3 className="fw-bold mb-4">Payment Method</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <div className="mb-4">
                        <Form.Check 
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            label={
                                <div className="d-flex align-items-center ms-2">
                                    <Banknote className="me-2 text-success" />
                                    <span className="fw-semibold">Pay at Delivery (Cash)</span>
                                </div>
                            }
                            checked={paymentMethod === 'COD'}
                            onChange={() => setPaymentMethod('COD')}
                            className="p-3 border rounded"
                        />
                    </div>

                    <h5 className="fw-bold mb-3">Order Summary</h5>
                    <div className="d-flex justify-content-between mb-2 text-muted">
                        <span>Subtotal</span>
                        <span>{totalAmount} TND</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-muted">
                        <span>Delivery Fee</span>
                        <span>{deliveryFee} TND</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                        <span className="fw-bold fs-5">Total to Pay</span>
                        <span className="fw-bold fs-5 text-danger">{totalAmount + deliveryFee} TND</span>
                    </div>

                    <Button 
                        variant="danger" 
                        className="w-100 py-2"
                        onClick={placeOrder}
                        disabled={loading}
                    >
                        {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Payment;
