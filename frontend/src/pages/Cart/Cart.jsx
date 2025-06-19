import { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../components/store/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = ({ setShowLogin }) => {
  const { token, cartItems, food_list, removeFromCart, getTotalCartAmount } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (token) {
      navigate("/order");
    } else {
      setShowLogin(true);
    }
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;
  const url = "http://localhost:3001";
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item) => {
          const quantity = cartItems[item._id];
          if (quantity > 0) {
            return (
              <div key={item._id} className="cart-items-title cart-items-item">
                <img
                  src={
                    item.image.startsWith("src/")
                      ? `${url}/images/${item.image}`
                      : item.image
                  }
                  alt={item.name}
                />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{quantity}</p>
                <p>${item.price * quantity}</p>
                <p onClick={() => removeFromCart(item._id)} className="cross">
                  X
                </p>
              </div>
            );
          }
          return null;
        })}
        <hr />
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${subtotal}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${deliveryFee}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${total}</b>
          </div>
          <button onClick={handleClick}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode"></div>
      </div>
    </div>
  );
};

export default Cart;
