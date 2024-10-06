import { useState, useEffect } from "react";
import useAuth from "../../context/UseAuth";
import { getAll } from "../../services/myfinances-api/Transaction";
import { getAll as getAllGoals } from "../../services/myfinances-api/FinancialGoal";
import { getUserToken } from "../../services/token/TokenService";
import { ChartSection } from "../../components/dashboard/chart/ChartSection";
import { BalanceSection } from "../../components/dashboard/BalanceSection";
import { AllTransactionsSection } from "../../components/dashboard/transactions/AllTransactionsSection";
import { IncomesSection } from "../../components/dashboard/transactions/IncomesSection";
import { ExpensesSection } from "../../components/dashboard/transactions/ExpensesSection";
import { LastGoal } from "../../components/dashboard/LastGoalSection";
import Alert from "../../components/Alert";
import { texts } from "../../constants/MyFinancesConstants";
import useDark from "../../context/UseDark";
import { getBalanceByUserId } from "../../services/myfinances-api/Balance";
import { HttpStatusCode } from "axios";
import { ReservesSection } from "../../components/dashboard/transactions/ReservesSection";


const Dashboard = () => {
    const { auth } = useAuth();
    const [transactions, setTransactions] = useState([{}]);
    const [activeGoals, setActiveGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [goalsAlert, setGoalsAlert] = useState({});
    const [transactionsAlert, setTransactionsAlert] = useState({});
    const [balance, setBalance] = useState({});
    const { dark } = useDark();

    const user = getUserToken();
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const { data, status } = await getBalanceByUserId(user.id, config);
                if (status === HttpStatusCode.Ok) {
                    setBalance(data);
                    setLoading(false);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        const fetchTransactions = async () => {
            try {
                const { data: response, status } = await getAll({ userId: user.id }, 1, 10, config);
                if (status === HttpStatusCode.Ok) {
                    const activeTransactions = response.data.filter((transaction) => !!transaction.isActive);
                    setTransactions(activeTransactions);
                    setLoading(false);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                setTransactionsAlert({
                    msg: texts.WITH_NO_TRANSACTIONS,
                    error: true
                });
                setTimeout(() => {
                    setTransactionsAlert({});
                }, 3000);
            }
        };
        const fetchGoals = async () => {
            try {
                const { data, status } = await getAllGoals({ userId: user.id }, 1, 10, config);
                if (status === HttpStatusCode.Ok) {
                    setActiveGoals(data.data);
                    setLoading(false);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                setGoalsAlert({
                    msgMeta: texts.WITH_NO_GOALS,
                    error: true
                });
                setTimeout(() => {
                    setGoalsAlert({});
                }, 3000);
            }
        };
        fetchBalance();
        fetchTransactions();
        fetchGoals();
    }, []);

    const { msg } = transactionsAlert;
    return (
        <div className="flex flex-col items-around p-10">
            {
                transactionsAlert ?
                    <div className="flex justify-end">
                        <div className="absolute">
                            {msg && <Alert alert={transactionsAlert} />}
                        </div>
                    </div> : <div></div>
            }
            <h2 className={(dark === "light" ?
                "mx-5 text-violet-800 font-bold uppercase "
                :
                "mx-5 text-gray-200 font-bold uppercase "
            )}
            >Hello, {user.firstName}</h2>
            <div className="bg-inherit rounded flex justify-between">
                <BalanceSection
                    auth={auth}
                    userId={user.id}
                    setTransactions={setTransactions}
                    balance={balance}
                    setBalance={setBalance} />
                <ChartSection
                    loading={loading}
                    transactions={transactions} />
                <LastGoal
                    activeGoals={activeGoals}
                    auth={auth}
                    loading={loading}
                    setActiveGoals={setActiveGoals}
                    balance={balance}
                    setBalance={setBalance}
                    setTransactions={setTransactions} />
            </div>
            <div className={(dark === "light" ?
                "bg-inherit p-10"
                :
                "bg-inherit p-10"
            )}
            >
                <AllTransactionsSection
                    className={(dark === "light" ?
                        "bg-inherit p-10"
                        :
                        "bg-gray-600 p-10"
                    )}
                    transactions={transactions} loading={loading} />
            </div>
            <div className="bg-inherit rounded flex justify-center">
                <IncomesSection loading={loading} transactions={transactions} />
                <ExpensesSection loading={loading} transactions={transactions} />
                <ReservesSection loading={loading} transactions={transactions} />
            </div>
        </div>
    );
};

export default Dashboard;

