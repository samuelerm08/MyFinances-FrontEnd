import { HttpStatusCode } from "axios";
import { texts, type } from "../../constants/MyFinancesConstants";
import { filterByType } from "../../services/myfinances-api/Transaction";
import useAuth from "../../context/UseAuth";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { BalancePagination } from "./BalancePagination";
import useDark from "../../context/UseDark";
import Alert from "../Alert";

export const BalanceReserves = ({ user, config }) => {
    const { auth } = useAuth();
    const [reserves, setReserves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reservesAlert, setReservesAlert] = useState({});
    const [metadata, setMetadata] = useState({});
    const { dark } = useDark();

    useEffect(() => {
        const payload = {
            userId: user.id,
            transactionType: type.RESERVE
        };
        const fetchReserves = async () => {
            try {
                const { data, status } = await filterByType(payload, 1, 5, config);
                if (status === HttpStatusCode.Ok) {
                    setLoading(false);
                    setReserves(data.data);
                    setMetadata(data.meta);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                setReservesAlert({
                    msg: texts.WITH_NO_RESERVES,
                    error: true
                });
                setTimeout(() => {
                    setReservesAlert({});
                }, 3000);
            }

        };
        fetchReserves();
    }, []);

    const { msg } = reservesAlert;
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
                >Reserves</h2>
                {
                    reservesAlert ?
                        <div className="flex justify-center">
                            <div className="absolute">
                                {msg && <Alert alert={reservesAlert} />}
                            </div>
                        </div> : <div></div>
                }
                {
                    loading ?
                        <div className="flex justify-center items-center h-full">
                            <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        reserves?.length
                            ?
                            <div className="flex justify-center mb-5">
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
                                        {reserves?.map((transaction, index) => {
                                            return (
                                                <tr className=" border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-10 text-gray-800 font-semibold text-sm"
                                                        : "text-gray-100 font-semibold py-2 px-10 text-sm"
                                                    )}>{transaction.details}</td>

                                                    {
                                                        transaction.details?.includes("Withdraw") ?
                                                            <td className="py-2 px-10 text-green-500 font-semibold font-mono text-sm">
                                                                <div className="w-28 flex justify-center rounded-md bg-green-200">
                                                                        +${parseFloat(transaction.amount).toFixed(2)}
                                                                </div>
                                                            </td> :
                                                            <td className="py-2 px-10 text-red-500 font-semibold font-mono text-sm">
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
            {
                metadata.totalCount > 10 ?
                    <div className="w-full mt-5">
                        <BalancePagination
                            setTransactions={setReserves}
                            auth={auth}
                            type={type.RESERVE}
                            setLoading={setLoading}
                            metadata={metadata}
                            setMetadata={setMetadata}
                        />
                    </div> : <div></div>
            }
        </div>
    );
};