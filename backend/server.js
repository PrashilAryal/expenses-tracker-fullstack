const { User } = require("./models");
const { Expense } = require("./models");

const PORT = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const { pool } = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

// Get all expenses
app.get("/expenses/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    // Joining tables ; because of foreign key
    const expenses = await Expense.findAll({
      where: { user_email: userEmail },
      // include: User,
    });
    console.log("Hello: ", expenses);
    // Single table ; not using foreign key
    // const expenses = await Expense.findAll({
    //   where: {
    //     user_id: userID,
    //   },
    // });

    const expenseObjects = expenses.map((expense) => expense.toJSON());
    console.log(expenseObjects);
    res.json({ expenses: expenseObjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// create a new transaction
app.post("/expenses", async (req, res) => {
  const {
    title,
    note,
    user_email,
    category_name,
    type,
    amount,
    createdAt,
    updatedAt,
  } = req.body;
  console.log("Hello ", category_name);
  try {
    const transaction = await Expense.create(req.body);
    console.log("hello");
    res.json(transaction);
  } catch (error) {
    console.error(error);
  }
});

// edit a transaction
app.put("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { title, note, user_email, category_name, type, amount } = req.body;

  try {
    const expense = await Expense.findOne({ where: { id } });
    if (expense) {
      expense.title = title;
      expense.note = note;
      expense.user_email = user_email;
      expense.category_name = category_name;
      expense.type = type;
      expense.amount = amount;
      await expense.save();
      res.json({ message: "Update Success" });
    } else {
      res.json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a expense
app.delete("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteExpense = await Expense.findByPk(id);
    await deleteExpense.destroy();
    res.json(deleteExpense);
  } catch (error) {
    console.error(error);
  }
});

// Sign up
app.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const users = await User.create({
      email: email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
    });
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: error.detail });
    }
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({ detail: "User not found" });
    }
    const loginSuccess = await bcrypt.compare(password, user.password);
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    if (loginSuccess) {
      res.json({ email: user.email, token });
    } else {
      res.json({ detail: "Login Failed!" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
