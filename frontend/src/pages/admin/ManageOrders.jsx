import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Package } from 'lucide-react';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('http://localhost:3002/api/order/list');
            if (res.data.success) {
                setOrders(res.data.data.reverse());
            }
        } catch (error) {
            console.error("Error fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const statusHandler = async (event, orderId) => {
        try {
            const res = await axios.post('http://localhost:3002/api/order/status', {
                orderId,
                status: event.target.value
            });
            if (res.data.success) {
                fetchAllOrders();
            }
        } catch (error) {
            console.error("Error updating status");
        }
    };

    if (loading) return <Spinner animation="border" variant="danger" />;

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <h3 className="fw-bold mb-4">Manage Orders</h3>
                <Table responsive hover className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>#</th>
                            <th>Items</th>
                            <th>Customer Info</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td>
                                    <Package className="text-danger" size={24} />
                                </td>
                                <td>
                                    {order.items.map((item, i) => {
                                        return item.name + " x " + item.quantity + (i === order.items.length - 1 ? "" : ", ")
                                    })}
                                </td>
                                <td>
                                    <p className="mb-1 fw-bold">{order.address.firstName} {order.address.lastName}</p>
                                    <p className="mb-1 small">{order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                                    <p className="mb-0 small">{order.address.phone}</p>
                                </td>
                                <td className="fw-bold">{order.amount} TND</td>
                                <td>
                                    <Form.Select 
                                        value={order.status} 
                                        onChange={(e) => statusHandler(e, order._id)}
                                        size="sm"
                                        className={order.status === 'Delivered' ? 'border-success text-success' : 'border-warning text-warning'}
                                    >
                                        <option value="Food Processing">Food Processing</option>
                                        <option value="Out for delivery">Out for delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default ManageOrders;
