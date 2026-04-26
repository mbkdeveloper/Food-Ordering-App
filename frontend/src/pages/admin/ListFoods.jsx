import React, { useEffect, useState, useContext } from 'react';
import { Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

const ListFoods = () => {
    const { token } = useContext(AuthContext);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchList = async () => {
        try {
            const response = await axios.get("http://localhost:3002/api/food/list");
            if (response.data.success) {
                setList(response.data.data);
            } else {
                setMessage({ type: 'danger', text: 'Error fetching foods' });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error fetching foods' });
        } finally {
            setLoading(false);
        }
    }

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post("http://localhost:3002/api/food/remove", { id: foodId }, {
                headers: {
                    'token': token
                }
            });
            await fetchList();
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Food Removed' });
            } else {
                setMessage({ type: 'danger', text: 'Error removing food' });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error removing food' });
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">All Foods List</h4>
                {message.text && <Alert variant={message.type} dismissible onClose={() => setMessage({type: '', text: ''})}>{message.text}</Alert>}
                <div className="table-responsive">
                    <Table hover align="middle" className="border">
                        <thead className="bg-light">
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <img 
                                                src={item.image.startsWith('http') ? item.image : `http://localhost:3002/images/${item.image}`}
                                                alt={item.name} 
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </td>
                                        <td className="fw-semibold">{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price} TND</td>
                                        <td>
                                            <Button variant="outline-danger" size="sm" onClick={() => removeFood(item._id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {list.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No food items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ListFoods;
