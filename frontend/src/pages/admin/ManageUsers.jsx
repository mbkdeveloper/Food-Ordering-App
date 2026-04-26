import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Button, Spinner, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Trash2, Edit2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ManageUsers = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState({ id: '', name: '', role: '', password: '' });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3002/api/user/list', { headers: { token } });
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.post('http://localhost:3002/api/user/remove', { id }, { headers: { token } });
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user");
            }
        }
    };

    const handleEditClick = (user) => {
        setEditUser({ id: user._id, name: user.name, role: user.role, password: '' });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3002/api/user/update', editUser, { headers: { token } });
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user");
        }
    };

    if (loading) return <Spinner animation="border" variant="danger" />;

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <h3 className="fw-bold mb-4">Manage Users</h3>
                <Table responsive hover className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="text-end">
                                    <Button variant="outline-primary" size="sm" className="me-2 p-1" onClick={() => handleEditClick(user)}>
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="p-1" onClick={() => deleteHandler(user._id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>

            {/* Edit User Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select value={editUser.role} onChange={(e) => setEditUser({...editUser, role: e.target.value})}>
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password (Optional)</Form.Label>
                            <Form.Control type="password" placeholder="Leave blank to keep current" minLength={8} value={editUser.password} onChange={(e) => setEditUser({...editUser, password: e.target.value})} />
                        </Form.Group>
                        <Button variant="danger" type="submit" className="w-100">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Card>
    );
};

export default ManageUsers;
