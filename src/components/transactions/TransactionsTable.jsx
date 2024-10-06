import { PulseLoader } from "react-spinners";
import { type } from "../../constants/MyFinancesConstants";
import { DeleteTransaction } from "../pop-ups/DeleteTransaction";
import { useEffect, useState } from "react";
import useAuth from "../../context/UseAuth";
import { getCategories } from "../../services/myfinances-api/Category";
import useDark from "../../context/UseDark";
import { ModifyTransaction } from "../pop-ups/ModifyTransaction";

export const TransactionsTable = ({ loading, transactions, setTransactions, balance }) => {
    const { auth } = useAuth();
    const orderedTransactions = transactions?.slice(0, 10);
    const [error, setError] = useState(null);
    const [deleteModal, setDeletePopUp] = useState(false);
    const [modifyModal, setModifyPopUp] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [transactionId, setTransactionId] = useState(0);
    const [transactionToModify, setTransaction] = useState({});
    const [categories, setCategories] = useState([""]);
    const { dark } = useDark();

    const handleModifyModal = (tId, t) => {
        setModifyPopUp(true);
        setTransactionId(tId);
        setTransaction(t);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };
    const handleDeletingModal = (tId) => {
        setDeletePopUp(true);
        setTransactionId(tId);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };
    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            }
        };
        const fetchCategorias = async () => {
            try {
                const { data: response } = await getCategories(config);
                const validCategories = response?.filter(({ title }) => !title.includes(type.RESERVE));
                setCategories(validCategories);
            } catch (error) {
                setError(error);
            }
        };
        fetchCategorias();
    }, []);
    return (
        <div className="t-table">
            {
                loading ?
                    <div className="flex justify-center items-center h-full">
                        <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                    </div>
                    :
                    <table className={(dark === "light" ?
                        "w-full border-collapse"
                        :
                        "bg-gray-600 rounded-lg w-full "
                    )}
                    >
                        <thead>
                            <tr>
                                <th className={(dark === "light" ?
                                    "text-left py-2 px-4 font-semibold text-violet-600"
                                    :
                                    "text-left py-2 px-4 font-semibold text-violet-400"
                                )}
                                >Details</th>
                                <th className={(dark === "light" ?
                                    "text-left py-2 px-4 font-semibold text-violet-600"
                                    :
                                    "text-left py-2 px-4 font-semibold text-violet-400"
                                )}
                                >Amount</th>
                                <th className={(dark === "light" ?
                                    "text-left py-2 px-4 font-semibold text-violet-600"
                                    :
                                    "text-left py-2 px-4 font-semibold text-violet-400"
                                )}
                                >Date</th>
                                <th className={(dark === "light" ?
                                    "text-left py-2 px-4 font-semibold text-violet-600"
                                    :
                                    "text-left py-2 px-4 font-semibold text-violet-400"
                                )}
                                >Type</th>
                                <th className={(dark === "light" ?
                                    "text-left py-2 px-4 font-semibold text-violet-600"
                                    :
                                    "text-left py-2 px-4 font-semibold text-violet-400"
                                )}
                                >State</th>
                                <th className={(dark === "light" ?
                                    "text-left py-2 px-4 font-semibold text-violet-600"
                                    :
                                    "text-left py-2 px-4 font-semibold text-violet-400"
                                )}
                                >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderedTransactions?.map((transaction, index) => {
                                return (
                                    <tr className={(dark === "light" ?
                                        "border-b border-gray-200 "
                                        :
                                        "border-b border-gray-500 "
                                    )}
                                    key={index}>

                                        <td className={(dark === "light" ?
                                            "py-2 px-4 text-gray-800 font-semibold"
                                            :
                                            "py-2 px-4 text-gray-200 font-semibold"
                                        )}
                                        >{transaction.details}</td>
                                        {
                                            transaction.transactionType === type.EXPENSE
                                                ?
                                                !transaction.isActive
                                                    ?
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-4 text-gray-400 font-semibold font-mono"
                                                        :
                                                        "py-2 px-4 text-gray-300 font-semibold font-mono"
                                                    )}>
                                                        -${parseFloat(transaction.amount).toFixed(2)}
                                                    </td>
                                                    :
                                                    <td className="py-2 px-4 text-red-500 font-semibold font-mono">
                                                        -${parseFloat(transaction.amount).toFixed(2)}
                                                    </td>
                                                : transaction.transactionType === type.INCOME ?
                                                    !transaction.isActive
                                                        ?
                                                        <td className="py-2 px-4 text-gray-400 font-semibold font-mono">
                                                            <div className="w-28 flex justify-center rounded-md bg-gray-200">
                                                                +${parseFloat(transaction.amount).toFixed(2)}
                                                            </div>
                                                        </td>
                                                        :
                                                        <td className="py-2 px-4 text-green-500 font-semibold font-mono">
                                                            <div className="w-28 flex justify-center rounded-md bg-green-200">
                                                                +${parseFloat(transaction.amount).toFixed(2)}
                                                            </div>
                                                        </td>
                                                    :
                                                    transaction.details?.includes("Deleted") ?
                                                        <td className="py-2 px-4 text-gray-400 font-semibold font-mono">
                                                            <div className="w-28 flex justify-center rounded-md bg-gray-200">
                                                                ${parseFloat(transaction.amount).toFixed(2)}
                                                            </div>
                                                        </td> :
                                                    transaction.details?.includes("Withdraw") || 
                                                    transaction.details?.includes("Lower amount") ?
                                                        <td className="py-2 px-4 text-green-500 font-semibold font-mono">
                                                            <div className="w-28 flex justify-center rounded-md bg-green-200">
                                                                +${parseFloat(transaction.amount).toFixed(2)}
                                                            </div>
                                                        </td> :
                                                        <td className="py-2 px-4 text-red-500 font-semibold font-mono">
                                                            -${parseFloat(transaction.amount).toFixed(2)}
                                                        </td>
                                        }
                                        {
                                            transaction.date
                                                ?
                                                !transaction.isActive
                                                    ?
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-4 text-gray-300  font-mono"
                                                        :
                                                        "py-2 px-4 text-gray-500  font-mono"
                                                    )}>{new Date(transaction.date).toLocaleDateString()}</td>
                                                    :
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-4 text-gray-400 font-semibold font-mono"
                                                        :
                                                        "py-2 px-4 text-gray-200 font-semibold font-mono"
                                                    )}>{new Date(transaction.date).toLocaleDateString()}</td>
                                                :
                                                <td></td>
                                        }
                                        {
                                            transaction.transactionType === type.EXPENSE ?
                                                <td className="py-2 px-4 text-gray-400">
                                                    {transaction.transactionType}
                                                    <span className="text-red-500 font-bold ml-2 pointer-events-none">
                                                        <i className="fa-solid fa-arrow-trend-down"></i>
                                                    </span>
                                                </td>
                                                :
                                                transaction.transactionType === type.INCOME ?
                                                    <td className="py-2 px-4 text-gray-400">
                                                        {transaction.transactionType}
                                                        <span className="text-green-500 font-bold ml-2 pointer-events-none">
                                                            <i className="fa-solid fa-arrow-trend-up"></i>
                                                        </span>
                                                    </td> :
                                                    <td className="py-2 px-4 text-gray-400">
                                                        {transaction.transactionType}
                                                        <i className="fa-solid fa-piggy-bank ml-2 pointer-events-none"></i>
                                                    </td>
                                        }
                                        {
                                            !transaction.isActive ?
                                                <td className="py-2 px-4 text-orange-400 font-semibold">
                                                    <div className="w-24 text-center rounded-md bg-orange-200">
                                                        Canceled
                                                    </div>
                                                </td> :
                                                <td className="py-2 px-4 text-green-500 font-semibold">
                                                    <div className="w-24 text-center rounded-md bg-green-200">
                                                        Active
                                                    </div>
                                                </td>
                                        }
                                        <td>
                                            <button disabled={!transaction.isActive || transaction.transactionType === type.RESERVE}>
                                                <i className={(dark === "light" ?
                                                    "fa-regular fa-pen-to-square text-gray-600 m-3"
                                                    :
                                                    "fa-regular fa-pen-to-square text-gray-200 m-3"
                                                )}
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="Modify"
                                                    onClick={e => handleModifyModal(transaction.id, transaction)}
                                                    style={!transaction.isActive || transaction.transactionType === type.RESERVE ?
                                                    { cursor: "not-allowed" } : { cursor: "pointer" }
                                                }>
                                                </i>
                                            </button>
                                            {
                                                modifyModal && <ModifyTransaction
                                                    setAnimate={setAnimate}
                                                    setPopUp={setModifyPopUp}
                                                    animate={animate}
                                                    transactionId={transactionId}
                                                    transaction={transactionToModify}
                                                    setTransaction={setTransaction}
                                                    setTransactions={setTransactions}
                                                    balance={balance}
                                                    categories={categories}
                                                />
                                            }
                                            <button disabled={!transaction.isActive || transaction.transactionType === type.RESERVE}>
                                                <i className="fa-solid fa-ban pl-2 text-red-600"
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="Cancel"
                                                    onClick={e => handleDeletingModal(transaction.id)}
                                                    style={!transaction.isActive || transaction.transactionType === type.RESERVE ?
                                                        { cursor: "not-allowed" } : { cursor: "pointer" }
                                                    }>
                                                </i>
                                            </button>
                                            {
                                                deleteModal && <DeleteTransaction
                                                    setAnimate={setAnimate}
                                                    setPopUp={setDeletePopUp}
                                                    animate={animate}
                                                    auth={auth}
                                                    transactionId={transactionId}
                                                    transactions={transactions}
                                                    setTransactions={setTransactions}
                                                />
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
            }
        </div>
    );
};