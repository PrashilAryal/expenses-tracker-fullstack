import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookies, removeCookies] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [transactions, setTransactions] = useState([]);

  const getData = async () => {
    console.log(userEmail);
    try {
      const response = await fetch(
        `http://localhost:8000/expenses/${userEmail}`
      );
      const jsond = await response.json();
      // console.log(json);
      setTransactions(jsond);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  console.log(transactions);

  const getExpenseTotal = () => {
    console.log(transactions);
    const expenseTransactions = transactions?.expenses?.filter(
      (transaction) => transaction.type === "expense"
    );
    const expenseAmounts = expenseTransactions?.map((e) => e.amount);
    const totalExpense = expenseAmounts?.reduce((a, c) => a + c, 0);
    return totalExpense;
  };
  const getIncomeTotal = () => {
    console.log(transactions);
    const incomeTransactions = transactions?.expenses?.filter(
      (transaction) => transaction.type === "income"
    );
    const incomeAmounts = incomeTransactions?.map((e) => e.amount);
    const totalIncome = incomeAmounts?.reduce((a, c) => a + c, 0);
    return totalIncome;
  };
  const getTotalBalance = () => {
    const totalBalance = getIncomeTotal() - getExpenseTotal();
    return totalBalance;
  };

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader appName={"Trackie"} getData={getData} />
          <p className="user-email">Hi, {userEmail}</p>
          <div className="dashboard-container">
            <p className="total-balance">Balance: Rs.{getTotalBalance()}</p>
            <div>
              <p className="total-expenses">
                Total Expenses: Rs.{getExpenseTotal()}
              </p>
              <p className="total-income">
                Total Income: Rs.{getIncomeTotal()}
              </p>
            </div>
          </div>
          {transactions?.expenses?.map((transaction) => (
            <ListItem
              key={transaction.id}
              transaction={transaction}
              getData={getData}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
