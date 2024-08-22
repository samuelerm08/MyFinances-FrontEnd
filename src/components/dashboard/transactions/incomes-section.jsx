import { PulseLoader } from "react-spinners";
import { texts, type } from "../../../constants/myfinances-constants";
import useDark from "../../../context/useDark";

export const IncomesSection = ({ loading, transactions }) => {
    const ingresos = transactions?.filter(({ transactionType }) => transactionType === type.INCOME);
    const { dark } = useDark();

    return (
        <div className={(dark === "light" ?
            "bg-gray-200 p-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 m-2 h-[400px]"
            : "bg-gray-600 p-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 m-2 h-[400px]"
        )}>
            <div>
                <h2 className={(dark === "light" ?
                    "font-bold text-center p-1 text-violet-600"
                    :
                    "font-bold text-center p-1 text-violet-400"
                )}>Last Ingresos</h2>
                <div className="bg-inherit rounded-lg pb-5">
                    {loading ?
                        <div className="flex justify-center">
                            <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        !!ingresos?.length
                            ?
                            <div className="w-full flex justify-center">
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
                                        {ingresos?.slice(0, 5).map((transaction, index) => {
                                            return (
                                                <tr className="border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "text-gray-600 text-sm py-2 px-10 font-bold"
                                                        :
                                                        "text-gray-300 text-sm py-2 px-10 font-bold"
                                                    )}
                                                    >{transaction.details}</td>
                                                    <td className="py-2 px-10 text-green-500 font-semibold font-mono text-sm">
                                                        <div className="w-28 flex justify-center rounded-md bg-green-300">
                                                            +${parseFloat(transaction.amount).toFixed(2)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className='pt-14 flex flex-col p-5 items-center text-center'>
                                <h3 className={(dark === "light" ?
                                    "text-lg text-center text-black" :
                                    "text-lg text-center text-white")}>
                                    {texts.WITH_NO_INCOMES}
                                </h3>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};