import "./Home.css";
import Button from "./../../components/UI/Button";
import { currencyFormatter } from "./../../util/Formating";
import { useContext } from "react";
import { StoreContext } from "../../components/store/StoreContext";

const Home = () => {
  const { addToCart, food_list } = useContext(StoreContext);
  const url = "http://localhost:3001";

  const resolveImagePath = (image) => {
    const trimmed = image.trim();
    return trimmed.includes("src/")
      ? trimmed
      : `${url}/images/${trimmed}`;
  };

  return (
    <div>
      <ul id="meals">
        {food_list.length === 0 ? (
          <p>Loading meals...</p>
        ) : (
          food_list.map((meal) => (
            <li className="meal-item" key={meal._id}>
              <article>
                <img src={resolveImagePath(meal.image)} alt={meal.name} />
                <div>
                  <h3>{meal.name}</h3>
                  <p className="meal-item-price">
                    {currencyFormatter.format(meal.price)}
                  </p>
                  <p className="meal-item-description">{meal.description}</p>
                </div>
                <p className="meal-item-actions">
                  <Button onClick={() => addToCart(meal._id)}>
                    Add to Cart
                  </Button>
                </p>
              </article>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Home;
