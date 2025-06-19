import PropTypes from "prop-types"; // ✅ Import
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./List.css";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to load food list.");
      }
    } catch (error) {
      toast.error("Error fetching data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Failed to delete item.");
      }
    } catch (error) {
      toast.error("Error deleting item.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : list.length === 0 ? (
        <p className="no-data">No food items found.</p>
      ) : (
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item) => (
            <div key={item._id} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p className="cursor delete-btn" onClick={() => removeFood(item._id)}>
                ✖
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

List.propTypes = {
  url: PropTypes.string.isRequired,
};

export default List;
