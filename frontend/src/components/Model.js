import { useState } from "react";
import { useCookies } from "react-cookie";

const Model = ({ mode, setShowModel, getData, transaction }) => {
  const [cookies, setCookies, removeCookies] = useCookies(null);
  const editMode = mode === "edit" ? true : false;

  const [data, setData] = useState({
    id: editMode ? transaction.id : null,
    title: editMode ? transaction.title : null,
    note: editMode ? transaction.note : null,
    user_email: editMode ? transaction.user_email : cookies.Email,
    category_name: editMode ? transaction.category_name : null,
    amount: editMode ? transaction.amount : null,
    type: editMode ? transaction.type : null,
    createdAt: editMode ? transaction.createdAt : new Date(),
    updatedAt: editMode ? transaction.updatedAt : new Date(),
  });

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        console.log("Working");
        setShowModel(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/expenses/${data.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModel(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
    console.log(data);
  };

  return (
    <div className="overlay">
      <div className="model">
        <div className="form-title-container">
          <h3>{mode} transaction</h3>
          <button onClick={() => setShowModel(false)}>X</button>
        </div>
        <form>
          <input
            value={data.id}
            type="hidden"
            onChange={handleChange}
            name="id"
          ></input>
          <label htmlFor="type">Type</label>
          <select onChange={handleChange} name="type" defaultValue={data?.type}>
            <option hidden disabled selected value={data?.type && data.type}>
              {data?.type ? data.type : "Select Type"}
            </option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <br />
          <label htmlFor="category">Category</label>
          <select
            onChange={handleChange}
            name="category_name"
            defaultValue={data?.category_name}
          >
            <option
              hidden
              disabled
              selected
              value={data?.category_name && data.category_name}
            >
              {data?.category_name ? data.category_name : "Select Category"}
            </option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="others">Others</option>
          </select>
          <br />
          <label htmlFor="title">Title</label>
          <input
            required
            maxLength={30}
            placeholder="Your transaction here..."
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="amount">Amount</label>
          <input
            required
            type="text"
            id="amount"
            name="amount"
            value={data.amount}
            placeholder="Your note here..."
            onChange={handleChange}
          />
          <label htmlFor="note">Note</label>
          <input
            required
            type="text"
            id="note"
            name="note"
            value={data.note}
            placeholder="Your note here..."
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>

          <input
            required
            type="text"
            name="user_email"
            placeholder="user_email here..."
            value={data.user_email}
            onChange={handleChange}
          />

          <button
            // className={mode + "-btn"}
            className="edit-button"
            type="submit"
            onClick={editMode ? editData : postData}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Model;
