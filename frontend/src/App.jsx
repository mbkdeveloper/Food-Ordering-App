import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import NavbarComponent from './components/Navbar';
import Home from './pages/client/Home';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Dashboard from './pages/admin/Dashboard';
import Cart from './pages/client/Cart';
import PlaceOrder from './pages/client/PlaceOrder';
import Payment from './pages/client/Payment';
import MyOrders from './pages/client/MyOrders';

const App = () => {
    const { user } = useContext(AuthContext);

    const ProtectedRoute = ({ children, requiredRole }) => {
        if (!user) return <Navigate to="/login" />;
        if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
        return children;
    };

    return (
        <>
            {(!user || user.role !== 'admin') && <NavbarComponent />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/'} />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/'} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<ProtectedRoute requiredRole="client"><PlaceOrder /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute requiredRole="client"><Payment /></ProtectedRoute>} />
                <Route path="/myorders" element={<ProtectedRoute requiredRole="client"><MyOrders /></ProtectedRoute>} />
                <Route path="/admin/*" element={
                    <ProtectedRoute requiredRole="admin">
                        <Dashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
};

export default App;
