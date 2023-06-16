import { useState } from "react";
import ListIcon from "./ListIcon";
import Model from "./Model";

const ListItem = ({ transaction, getData }) => {
  const [showModel, setShowModel] = useState(false);

  const deleteItem = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/expenses/${transaction.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li className="list-item">
      <div className="info-container">
        <ListIcon />
        <p className="transaction-title">{transaction.title}</p>

        <p className="transaction-category">{transaction.category_name}</p>
        <p>{transaction.type}</p>
        <p>{transaction.note}</p>
        <p className="transaction-amount">Rs.{transaction.amount}</p>
      </div>
      <div className="button-container">
        <button className="edit-button" onClick={() => setShowModel(true)}>
          Edit
        </button>
        <button className="delete-button" onClick={deleteItem}>
          Delete
        </button>
      </div>

      {showModel && (
        <Model
          mode={"edit"}
          setShowModel={setShowModel}
          getData={getData}
          transaction={transaction}
        />
      )}
    </li>
  );
};

export default ListItem;
