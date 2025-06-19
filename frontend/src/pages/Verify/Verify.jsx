import { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../components/store/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            if (!success || !orderId) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.post(`${url}/api/order/verify`, {
                    success,
                    orderId
                });

                if (response.data.success) {
                    navigate("/myorders");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Payment verification failed:", error);
                navigate("/");
            }
        };

        verifyPayment();
    }, [success, orderId, navigate, url]);

    return (
        <div className="verify">
            <div className="spinner"></div>
            <p>Vérification de votre paiement en cours...</p>
        </div>
    );
};

export default Verify;
