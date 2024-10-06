import { useEffect, useState } from "react";
import { getUserToken } from "../../services/token/TokenService";
import useAuth from "../../context/UseAuth";
import { BalanceIncomes } from "../../components/balance/IncomesComponent";
import { BalanceExpenses } from "../../components/balance/ExpensesComponent";
import { BalanceComponent } from "../../components/balance/BalanceComponent";
import { getBalanceByUserId } from "../../services/myfinances-api/Balance";
import { getAll } from "../../services/myfinances-api/Transaction";
import { HttpStatusCode } from "axios";
import { BalanceReserves } from "../../components/balance/ReserveComponent";
import { RevenueChart } from "../../components/balance/chart/RevenueChart";

const Balance = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);

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
                const { data: result, status } = await getAll({ userId: user.id }, 1, 10, config);
                if (status === HttpStatusCode.Ok) {
                    const filteredTransactions = result.data.filter(({ isActive }) => isActive);
                    setTransactions(filteredTransactions);
                    setLoading(false);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchTransactions();
        fetchBalance();
    }, []);


    return (
        <div>
            <div className="bg-inherit p-2 flex justify-center">
                <BalanceIncomes user={user} config={config} />
                <BalanceExpenses user={user} config={config} />
                <BalanceReserves user={user} config={config} />
            </div>
            <div className="bg-inherit p-2 flex justify-center">
                <BalanceComponent loading={loading} balance={balance} />
            </div>
            <div className="flex flex-col items-center">
                <RevenueChart transactions={transactions} />
            </div>
        </div>
    );
};

export default Balance;