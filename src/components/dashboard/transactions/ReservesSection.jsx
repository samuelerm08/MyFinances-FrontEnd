import { PulseLoader } from "react-spinners";
import { texts, type } from "../../../constants/MyFinancesConstants";
import useDark from "../../../context/UseDark";
import Alert from "../../Alert";

export const ReservesSection = ({ loading, transactions }) => {
    const reserves = transactions?.filter(({ transactionType }) => transactionType === type.RESERVE);
    const { dark } = useDark();

    return (
        <div className={(dark === "light" ?
            "bg-gray-200 p-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 m-2 h-[400px]"
            : "bg-gray-600 p-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 m-2 h-[400px]"
        )}
        >
            <div>
                <h2 className={(dark === "light" ?
                    "p-1 text-center font-semibold text-violet-600"
                    : "p-1 text-center font-semibold text-violet-400"
                )}
                >Last Reserves</h2>
                <div className="bg-inherit rounded-lg">
                    {loading ?
                        <div className="flex justify-center">
                            <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        !!reserves?.length
                            ?
                            <div className="flex justify-center">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={(dark === "light" ?
                                                "font-bold text-center py-2 px-10 text-violet-600"
                                                :
                                                "font-bold text-center py-2 px-10 text-violet-400"
                                            )}>Transaction</th>
                                            <th className={(dark === "light" ?
                                                "font-bold text-center py-2 px-10 text-violet-600"
                                                :
                                                "font-bold text-center py-2 px-10 text-violet-400"
                                            )}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reserves?.slice(0, 5).map((transaction, index) => {
                                            return (
                                                <tr className=" border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "text-gray-600 text-sm py-2 px-10 font-bold"
                                                        :
                                                        "text-gray-300 text-sm py-2 px-10 font-bold"
                                                    )}>{transaction.details}</td>

                                                    {
                                                        transaction.details?.includes("Withdraw") ?
                                                            <td className="py-2 px-10 text-green-500 font-semibold font-mono text-sm">
                                                                <div className="w-28 flex justify-center rounded-md bg-green-200">
                                                                    +${parseFloat(transaction.amount).toFixed(2)}
                                                                </div>
                                                            </td> :
                                                            <td className="py-2 px-10 text-red-500 font-semibold font-mono">
                                                                -${parseFloat(transaction.amount).toFixed(2)}
                                                            </td>
                                                    }
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className="flex justify-center p-32">
                                <h3 className={(dark === "light" ?
                                    "text-lg text-center text-black" :
                                    "text-lg text-center text-white")}>
                                    {texts.WITH_NO_RESERVES}
                                </h3>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};