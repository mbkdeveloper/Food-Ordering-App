import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AddFood = () => {
    const { token } = useContext(AuthContext);
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Traditional"
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("image", image)
        
        try {
            const response = await axios.post("http://localhost:3002/api/food/add", formData, {
                headers: {
                    'token': token
                }
            });
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Traditional"
                })
                setImage(false)
                setMessage({ type: 'success', text: 'Food Added Successfully!' })
            } else {
                setMessage({ type: 'danger', text: response.data.message })
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error adding food' })
        }
    }

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Add New Food Item</h4>
                {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={onSubmitHandler}>
                    <Form.Group className="mb-4">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder="Type here" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Description</Form.Label>
                        <Form.Control as="textarea" rows={4} name="description" value={data.description} onChange={onChangeHandler} placeholder="Write content here" required />
                    </Form.Group>
                    <div className="d-flex gap-4 mb-4">
                        <Form.Group className="flex-grow-1">
                            <Form.Label>Product Category</Form.Label>
                            <Form.Select name="category" value={data.category} onChange={onChangeHandler}>
                                <option value="Traditional">Traditional</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Soup">Soup</option>
                                <option value="Main">Main</option>
                                <option value="Fast Food">Fast Food</option>
                                <option value="Street Food">Street Food</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="flex-grow-1">
                            <Form.Label>Product Price (TND)</Form.Label>
                            <Form.Control type="number" name="price" value={data.price} onChange={onChangeHandler} placeholder="0" required />
                        </Form.Group>
                    </div>
                    <Button variant="danger" type="submit" className="px-5">
                        ADD ITEM
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddFood;
