import { PulseLoader } from "react-spinners";
import { type } from "../../../constants/myfinances-constants";
import useDark from "../../../context/useDark";

export const AllTransactionsSection = ({ transactions, loading }) => {
    const { dark } = useDark();

    const orderedTransactions = transactions?.slice(0, 5);
    return (
        <div className={(dark === "light" ?
            "bg-inherit p-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 border"
            :
            "bg-gray-600 p-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400"
        )}
        >
            <div className="flex justify-center mb-5">
                <h3 className={(dark === "light" ?
                    "font-bold text-violet-600"
                    :
                    "font-bold text-violet-400"
                )}
                >Last Transactions</h3>
            </div>
            {
                !!loading ?
                    <div className="flex justify-center">
                        <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                    </div>
                    :
                    <div className="flex justify-center">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-10 font-semibold text-violet-600"
                                        :
                                        "bg-gray-600 text-left py-2 px-10 font-semibold text-violet-400"
                                    )}
                                    >Details</th>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-10 font-semibold text-violet-600"
                                        :
                                        "bg-gray-600 text-left py-2 px-10 font-semibold text-violet-400"
                                    )}
                                    >Amount</th>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-10 font-semibold text-violet-600"
                                        :
                                        "bg-gray-600 text-left py-2 px-10 font-semibold text-violet-400"
                                    )}
                                    >Date</th>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-10 font-semibold text-violet-600"
                                        :
                                        "bg-gray-600 text-left py-2 px-10 font-semibold text-violet-400"
                                    )}
                                    >Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orderedTransactions.map((transaction, index) => {
                                        return (
                                            <tr className={(dark === "light" ?
                                                "border-b border-gray-200"
                                                :
                                                "bg-gray-600 border-b border-gray-500"
                                            )}
                                                key={index}
                                            >
                                                <td className={(dark === "light" ?
                                                    "text-gray-600 py-2 px-10 font-semibold"
                                                    :
                                                    "text-gray-300 py-2 px-10 font-semibold"
                                                )}
                                                >{transaction.details}</td>
                                                {
                                                    transaction.transactionType === type.EXPENSE ?
                                                        <td className="py-2 px-10 text-red-500 font-semibold font-mono">
                                                            -${parseFloat(transaction.amount).toFixed(2)}
                                                        </td> :
                                                        transaction.transactionType === type.INCOME ?
                                                            <td className="py-2 px-10 text-green-500 font-semibold font-mono">
                                                                <div className="w-28 flex justify-center rounded-md bg-green-200">
                                                                    +${parseFloat(transaction.amount).toFixed(2)}
                                                                </div>
                                                            </td> :
                                                            transaction.transactionType === type.RESERVE ?
                                                                transaction.details?.includes("Deleted") ?
                                                                    <td className="py-2 px-10 text-gray-400 font-semibold font-mono">
                                                                        <div className="w-28 flex justify-center rounded-md bg-gray-200">
                                                                            ${parseFloat(transaction.amount).toFixed(2)}
                                                                        </div>
                                                                    </td> :
                                                                transaction.details?.includes("Withdraw") || 
                                                                transaction.details?.includes("Lower amount") ?
                                                                    <td className="py-2 px-10 text-green-500 font-semibold font-mono">
                                                                        <div className="w-28 flex justify-center rounded-md bg-green-200">
                                                                            +${parseFloat(transaction.amount).toFixed(2)}
                                                                        </div>
                                                                    </td> :
                                                                    <td className="py-2 px-10 text-red-500 font-semibold font-mono">
                                                                        -${parseFloat(transaction.amount).toFixed(2)}
                                                                    </td>
                                                                : <td></td>
                                                }
                                                {
                                                    transaction.date ?
                                                        <td className={(dark === "light" ?
                                                            "py-2 px-10 text-gray-600 font-semibold font-mono"
                                                            :
                                                            "py-2 px-10 text-gray-300 font-semibold font-mono"
                                                        )}
                                                        >{new Date(transaction.date).toLocaleDateString()}</td> :
                                                        <td></td>
                                                }
                                                {
                                                    transaction && transaction.transactionType === type.EXPENSE ?
                                                        <td className="py-2 px-10 text-gray-400">
                                                            {transaction.transactionType}
                                                            <span className="text-red-500 font-bold ml-1 pointer-events-none">
                                                                <i className="fa-solid fa-arrow-trend-down"></i>
                                                            </span>
                                                        </td>
                                                        :
                                                        transaction && transaction.transactionType === type.INCOME ?
                                                            <td className="py-2 px-10 text-gray-400">
                                                                {transaction.transactionType}
                                                                <span className="text-green-500 font-bold ml-1 pointer-events-none">
                                                                    <i className="fa-solid fa-arrow-trend-up"></i>
                                                                </span>
                                                            </td> :
                                                            transaction.transactionType === type.RESERVE ?
                                                                <td className="py-2 px-10 text-gray-400">
                                                                    {transaction.transactionType}
                                                                    <i className="fa-solid fa-piggy-bank ml-1 pointer-events-none"></i>
                                                                </td>
                                                                : <td></td>
                                                }
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
            }
        </div>
    );
};