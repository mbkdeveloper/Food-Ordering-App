import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});

    // Fetch food list
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await axios.get('http://localhost:3002/api/food/list');
                if (res.data.success) {
                    setFoodList(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch foods', err);
            }
        };
        fetchFoods();
    }, []);

    // Handle Auth
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                // Also fetch cart when logged in
                if (decoded.role === 'client') {
                    const initCart = async () => {
                        await loadCartData(token);
                        
                        // Check for pending item
                        const pendingItem = localStorage.getItem('pendingCartItem');
                        if (pendingItem) {
                            try {
                                await axios.post('http://localhost:3002/api/cart/add', { itemId: pendingItem }, { headers: { token }});
                                setCartItems((prev) => ({ ...prev, [pendingItem]: (prev[pendingItem] || 0) + 1 }));
                                localStorage.removeItem('pendingCartItem');
                            } catch(e) {
                                console.error(e);
                            }
                        }
                    };
                    initCart();
                }
            } catch (err) {
                console.error('Invalid token');
                setToken('');
                localStorage.removeItem('token');
                setUser(null);
            }
        } else {
            setUser(null);
            setCartItems({});
        }
    }, [token]);

    const loadCartData = async (userToken) => {
        try {
            const res = await axios.post('http://localhost:3002/api/cart/get', {}, { headers: { token: userToken }});
            if (res.data.success) {
                setCartItems(res.data.cartData);
            }
        } catch (error) {
            console.error('Failed to load cart', error);
        }
    }

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setCartItems({});
    };

    // Cart Logic
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post('http://localhost:3002/api/cart/add', { itemId }, { headers: { token }});
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post('http://localhost:3002/api/cart/remove', { itemId }, { headers: { token }});
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = foodList.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalItems = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                total += cartItems[item];
            }
        }
        return total;
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, foodList, cartItems, setCartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalItems }}>
            {children}
        </AuthContext.Provider>
    );
};
