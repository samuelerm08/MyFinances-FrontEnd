import { PulseLoader } from "react-spinners";
import { texts, type } from "../../constants/myfinances-constants";
import { useEffect, useState } from "react";
import { filterByType } from "../../services/myfinances-api/transacciones";
import Alerta from "../Alerta";
import { BalancePagination } from "./balance-pagination";
import useAuth from "../../context/useAuth";
import useDark from "../../context/useDark";
import { HttpStatusCode } from "axios";

export const BalanceExpenses = ({ user, config }) => {
    const { auth } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [cargando, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expensesAlert, setExpensesAlert] = useState({});
    const [metadata, setMetadata] = useState({});
    const { dark } = useDark();
    useEffect(() => {
        const fetchExpenses = async () => {
            const payload = {
                userId: user.id,
                tipo: type.EGRESO
            };
            try {
                const { data, status } = await filterByType(payload, 1, 5, config);
                if (status === HttpStatusCode.Ok) {
                    setLoading(false);
                    const validExpenses = data?.data.filter(({ estaActiva }) => estaActiva);
                    setExpenses(validExpenses);
                    setMetadata(data.meta);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                setExpensesAlert({
                    msg: texts.WITH_NO_EXPENSES,
                    error: true
                });
                setTimeout(() => {
                    setExpensesAlert({});
                }, 3000);
            }
        };
        fetchExpenses();
    }, []);
    const { msg } = expensesAlert;
    return (
        <div className={(dark === "light" ?
            "w-1/4 bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-violet-400 mx-5"
            : "w-1/4 bg-gray-600 p-4 rounded-lg shadow-md hover:shadow-violet-400 mx-5"
        )}
        >
            <div className="t-table">
                <h2 className={(dark === "light" ?
                    "p-1 text-center font-semibold text-violet-600"
                    : "p-1 text-center font-semibold text-violet-400"
                )}
                >Gastos</h2>
                {
                    !!expensesAlert ?
                        <div className="flex justify-center">
                            <div className="absolute">
                                {msg && <Alerta alerta={expensesAlert} />}
                            </div>
                        </div> : <div></div>
                }
                {
                    !!cargando ?
                        <div className="flex justify-center">
                            <PulseLoader loading={cargando} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        !!expenses?.length
                            ?
                            <div className="flex justify-center mb-5">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={(dark === "light" ?
                                                "text-center py-2 px-10 font-semibold text-violet-600 text-sm"
                                                : "text-center py-2 px-10 font-semibold text-violet-400 text-sm"
                                            )}
                                            >Transacción</th>
                                            <th className={(dark === "light" ?
                                                "text-center py-2 px-10 font-semibold text-violet-600 text-sm"
                                                : "text-center py-2 px-10 font-semibold text-violet-400 text-sm"
                                            )}
                                            >Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses?.map((transaccion, index) => {
                                            return (
                                                <tr className=" border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-10 text-gray-800 font-semibold text-sm"
                                                        : "text-gray-100 font-semibold py-2 px-10 text-sm"
                                                    )}>{transaccion.detalle}</td>
                                                    <td className="py-2 px-10 text-red-500 font-semibold font-mono text-sm">
                                                        <div className="w-28 flex justify-center">
                                                            -${parseFloat(transaccion.monto).toFixed(2)}
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
                                    {texts.WITH_NO_EXPENSES}
                                </h3>
                            </div>
                }
            </div>
            {
                metadata?.totalCount > 10 ?
                    <div className="w-full">
                        <BalancePagination
                            setTransactions={setExpenses}
                            auth={auth}
                            type={type.EGRESO}
                            setLoading={setLoading}
                            metadata={metadata}
                            setMetadata={setMetadata}
                        />
                    </div> : <div></div>
            }
        </div>
    );
};