import { useState, useEffect } from "react";
import { getUserToken } from "../../services/token/TokenService";
import useAuth from "../../context/UseAuth";
import { getAll } from "../../services/myfinances-api/Transaction";
import { getCategories } from "../../services/myfinances-api/Category";
import { getBalanceByUserId } from "../../services/myfinances-api/Balance";
import { TransactionsTable } from "../../components/transactions/TransactionsTable";
import { texts, type } from "../../constants/MyFinancesConstants";
import Alert from "../../components/Alert";
import { DateFilter } from "../../components/transactions/filters/DateFilter";
import { TypeFilter } from "../../components/transactions/filters/TypeFilter";
import { StateFilter } from "../../components/transactions/filters/StateFilter";
import { AmountFilter } from "../../components/transactions/filters/AmountFilter";
import { TransactionsPagination } from "../../components/transactions/TransactionsPagination";
import useDark from "../../context/UseDark";
import TransactionPopUp from "../../components/pop-ups/TransactionPopUp";

const Transactions = () => {
    const { auth } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [balance, setBalance] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [categories, setCategories] = useState([""]);
    const [alert, setAlert] = useState({});
    const [hasNextPage, setHasNextPage] = useState(true);
    const [transactionType, setType] = useState("");
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [state, setState] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { dark } = useDark();

    const [payloadProps, setPayloadProps] = useState({
        userId: null,
        transactionType: null,
        date: null,
        montoHasta: null,
        isActive: null
    });

    const handleModalClosing = () => {
        setPopUp(true);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };

    const user = getUserToken();
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };

    const handleFiltersReset = async () => {
        setLoading(true);
        try {
            const { data: response } = await getAll({ userId: user.id }, 1, 10, config);
            setLoading(false);
            setTransactions(response.data);
            setMetadata(response.meta);
            setCurrentPage(1);
            setHasNextPage(response.meta.hasNextPage);
            setType("");
            setDate("");
            setAmount("");
            setState("");
            setPayloadProps({
                transactionType: null,
                date: null,
                amountUpTo: null,
                isActive: null
            });
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data: response } = await getAll({ userId: user.id }, 1, 10, config);
                setTransactions(response.data);
                setMetadata(response.meta);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
                setAlert({
                    msg: texts.WITH_NO_TRANSACTIONS,
                    error: true
                });
                setTimeout(() => {
                    setAlert({});
                }, 3000);
            }
        };
        const fetchCategories = async () => {
            try {
                const { data: response } = await getCategories(config);
                const validCategories = response?.filter(({ title }) => !title.includes(type.RESERVE));
                setCategories(validCategories);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        const fetchBalance = async () => {
            try {
                const { data: response } = await getBalanceByUserId(user.id, config);
                setBalance(response);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchTransactions();
        fetchCategories();
        fetchBalance();
    }, []);

    const { msg } = alert;

    return (
        <div className={(dark === "light" ?
            "bg-inherit p-10"
            :
            "bg-inherit p-10"
        )}
        >
            {alert ?
                <div className="flex justify-end mb-20">
                    <div className="absolute">
                        {msg && <Alert alert={alert} />}
                    </div>
                </div> : <div></div>}
            <div className="flex justify-between items-center mb-5">
                <div className='flex items-center'>
                    <button
                        type="button"
                        className='text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold p-absolute shadow-md hover:shadow-violet-500'
                        onClick={handleModalClosing}
                    >
                        New Transaction
                    </button>

                    {popUp &&
                        <TransactionPopUp
                            setPopUp={setPopUp}
                            animate={animate}
                            setAnimate={setAnimate}
                            categories={categories}
                            balance={balance}
                            setTransactions={setTransactions}
                            transactions={transactions}
                            setMetadata={setMetadata}
                            metadata={metadata}
                        />
                    }
                </div>
                <div className="flex justify-center items-center">
                    <AmountFilter
                        setLoading={setLoading}
                        setAlert={setAlert}
                        setCurrentPage={setCurrentPage}
                        setTransactions={setTransactions}
                        setMetadata={setMetadata}
                        setPayloadProps={setPayloadProps}
                        setAmount={setAmount}
                        amount={amount}
                        payloadProps={payloadProps} />
                    <DateFilter
                        setTransactions={setTransactions}
                        setAlert={setAlert}
                        setLoading={setLoading}
                        setMetadata={setMetadata}
                        setCurrentPage={setCurrentPage}
                        setPayloadProps={setPayloadProps}
                        date={date}
                        setDate={setDate}
                        payloadProps={payloadProps} />
                    <TypeFilter
                        setLoading={setLoading}
                        setAlert={setAlert}
                        setCurrentPage={setCurrentPage}
                        setTransactions={setTransactions}
                        setMetadata={setMetadata}
                        setPayloadProps={setPayloadProps}
                        setType={setType}
                        transactionType={transactionType}
                        payloadProps={payloadProps} />
                    <StateFilter
                        setLoading={setLoading}
                        setAlert={setAlert}
                        setCurrentPage={setCurrentPage}
                        setTransactions={setTransactions}
                        setMetadata={setMetadata}
                        setPayloadProps={setPayloadProps}
                        setState={setState}
                        state={state}
                        payloadProps={payloadProps} />
                </div>
                <button
                    className="text-white text-sm bg-red-500 p-3 rounded-md uppercase font-semibold p-absolute shadow-md hover:shadow-red-600"
                    onClick={() => handleFiltersReset()}>
                    Reset Filters
                </button>
            </div>
            <div className={(dark === "light" ?
                "bg-inherit p-4 rounded-lg shadow-md hover:shadow-violet-400 border"
                :
                "bg-gray-600 p-4 rounded-lg shadow-md hover:shadow-violet-400"
            )}
            >
                <TransactionsTable
                    loading={loading}
                    transactions={transactions}
                    setTransactions={setTransactions}
                    metadata={metadata}
                    balance={balance}
                />
                {
                    metadata.totalCount > 10 ?
                        <div className="w-full">
                            <TransactionsPagination
                                setTransactions={setTransactions}
                                metadata={metadata}
                                hasNextPage={hasNextPage}
                                setHasNextPage={setHasNextPage}
                                setLoading={setLoading}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                payloadProps={payloadProps}
                            />
                        </div> : <div></div>
                }
            </div>
        </div>
    );
};

export default Transactions;