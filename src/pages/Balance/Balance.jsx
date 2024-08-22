import { useEffect, useState } from "react";
import { getUserToken } from "../../services/token/tokenService";
import useAuth from "../../context/useAuth";
import { BalanceIncomes } from "../../components/balance/incomes-component";
import { BalanceExpenses } from "../../components/balance/expenses-component";
import { BalanceComponent } from "../../components/balance/balance-component";
import { RevenueChart } from "../../components/balance/chart/revenue-chart";
import { getBalanceByUserId } from "../../services/myfinances-api/balance";
import { getAll } from "../../services/myfinances-api/transaction";
import { HttpStatusCode } from "axios";
import { BalanceReserves } from "../../components/balance/reserve-component";

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
                const res = await getBalanceByUserId(user.id, config);
                if (res) {
                    setBalance(res);
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
                    const filteredTransactions = response.data.filter(({ isActive }) => isActive);
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