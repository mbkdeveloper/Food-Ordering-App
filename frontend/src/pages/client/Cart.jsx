import React, { useContext } from 'react';
import { Container, Table, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
    const { cartItems, foodList, removeFromCart, addToCart, getTotalCartAmount } = useContext(AuthContext);
    const navigate = useNavigate();

    const totalAmount = getTotalCartAmount();
    const deliveryFee = totalAmount === 0 ? 0 : 2;

    return (
        <Container className="py-5">
            <h2 className="fw-bold mb-4">Your Basket</h2>
            <Row>
                <Col lg={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Items</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th className="pe-4 text-end">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foodList.map((item, index) => {
                                        if (cartItems[item._id] > 0) {
                                            return (
                                                <tr key={index}>
                                                    <td className="ps-4">
                                                        <img 
                                                            src={item.image.startsWith('http') ? item.image : `http://localhost:3002/images/${item.image}`}
                                                            alt={item.name} 
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                                        />
                                                    </td>
                                                    <td className="fw-semibold">{item.name}</td>
                                                    <td>{item.price} TND</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <Button variant="light" size="sm" onClick={() => removeFromCart(item._id)} className="p-1">
                                                                <Minus size={16} />
                                                            </Button>
                                                            <span className="mx-3 fw-bold">{cartItems[item._id]}</span>
                                                            <Button variant="light" size="sm" onClick={() => addToCart(item._id)} className="p-1">
                                                                <Plus size={16} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="fw-bold">{item.price * cartItems[item._id]} TND</td>
                                                    <td className="pe-4 text-end">
                                                        <Button variant="link" className="text-danger p-0" onClick={() => removeFromCart(item._id)}>
                                                            <Trash2 size={20} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        return null;
                                    })}
                                    {totalAmount === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                Your basket is empty.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
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
                                className="w-100" 
                                disabled={totalAmount === 0}
                                onClick={() => navigate('/order')}
                            >
                                PROCEED TO CHECKOUT
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Cart;
