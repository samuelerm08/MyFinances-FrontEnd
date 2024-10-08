import { PulseLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { filterByType } from "../../services/myfinances-api/Transaction";
import { texts, type } from "../../constants/MyFinancesConstants";
import { BalancePagination } from "./BalancePagination";
import useAuth from "../../context/UseAuth";
import useDark from "../../context/UseDark";
import { HttpStatusCode } from "axios";
import Alert from "../Alert";

export const BalanceIncomes = ({ user, config }) => {
    const { auth } = useAuth();
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [incomesAlert, setIncomesAlert] = useState({});
    const [metadata, setMetadata] = useState({});
    const { dark } = useDark();

    useEffect(() => {
        const fetchIncomes = async () => {
            const payload = {
                userId: user.id,
                transactionType: type.INCOME
            };
            try {
                const { data, status } = await filterByType(payload, 1, 5, config);
                if (status === HttpStatusCode.Ok) {
                    const validIncomes = data?.data.filter(({ isActive }) => isActive);
                    setIncomes(validIncomes);
                    setMetadata(data.meta);
                    setLoading(false);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                setIncomesAlert({
                    msg: texts.WITH_NO_INCOMES,
                    error: true
                });
                setTimeout(() => {
                    setIncomesAlert({});
                }, 3000);
            }
        };
        fetchIncomes();
    }, []);
    const { msg } = incomesAlert;
    return (
        <div className={(dark === "light" ?
            "w-1/3 bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-violet-400 mx-5 mb-0 flex flex-col justify-between items-center"
            : "w-1/3 bg-gray-600 p-4 rounded-lg shadow-md hover:shadow-violet-400 mx-5 mb-0 flex flex-col justify-between items-center"
        )}
        >
            <div className="h-[500px]">
                <h2 className={(dark === "light" ?
                    "p-1 text-center font-semibold text-violet-600"
                    : "p-1 text-center font-semibold text-violet-400"
                )}
                >Incomes</h2>
                {
                    !!incomesAlert ?
                        <div className="flex justify-center">
                            <div className="absolute">
                                {msg && <Alert alert={incomesAlert} />}
                            </div>
                        </div> : <div></div>
                }
                {
                    !!loading ?
                        <div className="flex justify-center items-center h-full">
                            <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        !!incomes?.length
                            ?
                            <div className="flex justify-center">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={(dark === "light" ?
                                                "text-center py-2 px-10 font-semibold text-violet-600 text-sm"
                                                : "text-center py-2 px-10 font-semibold text-violet-400 text-sm"
                                            )}
                                            >Transaction</th>
                                            <th className={(dark === "light" ?
                                                "text-center py-2 px-10 font-semibold text-violet-600 text-sm"
                                                : "text-center py-2 px-10 font-semibold text-violet-400 text-sm"
                                            )}
                                            >Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomes?.map((transaction, index) => {
                                            return (
                                                <tr className=" border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-10 text-gray-800 font-semibold text-sm"
                                                        : "text-gray-100 font-semibold py-2 px-10 text-sm"
                                                    )}>{transaction.details}</td>
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
                            <div className="flex justify-center p-32">
                                <h3 className={(dark === "light" ?
                                    "text-lg text-center text-black" :
                                    "text-lg text-center text-white")}>
                                    {texts.WITH_NO_INCOMES}
                                </h3>
                            </div>
                }
            </div>
            {
                metadata?.totalCount > 10 ?
                    <div className="w-full mt-5">
                        <BalancePagination
                            setTransactions={setIncomes}
                            auth={auth}
                            type={type.INCOME}
                            setLoading={setLoading}
                            metadata={metadata}
                            setMetadata={setMetadata}
                        />
                    </div> : <div></div>
            }
        </div>
    );
};