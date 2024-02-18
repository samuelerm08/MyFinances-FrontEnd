import { PulseLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { filterByType } from "../../services/myfinances-api/transacciones";
import { texts, type } from "../../constants/myfinances-constants";
import Alerta from "../Alerta";
import { BalancePagination } from "./balance-pagination";
import useAuth from "../../context/useAuth";
import useDark from "../../context/useDark";
import { HttpStatusCode } from "axios";

export const BalanceIncomes = ({ user, config }) => {
    const { auth } = useAuth();
    const [incomes, setIncomes] = useState([]);
    const [cargando, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [incomesAlert, setIncomesAlert] = useState({});
    const [metadata, setMetadata] = useState({});
    const { dark } = useDark();

    useEffect(() => {
        const fetchIncomes = async () => {
            const payload = {
                userId: user.id,
                tipo: type.INGRESO
            };
            try {
                const { data, status } = await filterByType(payload, 1, 5, config);
                if (status === HttpStatusCode.Ok) {
                    setLoading(false);
                    const validIncomes = data?.data.filter(({ estaActiva }) => estaActiva);
                    setIncomes(validIncomes);
                    setMetadata(data.meta);
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
                >Ingresos</h2>
                {
                    !!incomesAlert ?
                        <div className="flex justify-center">
                            <div className="absolute">
                                {msg && <Alerta alerta={incomesAlert} />}
                            </div>
                        </div> : <div></div>
                }
                {
                    !!cargando ?
                        <div className="flex justify-center items-center h-full">
                            <PulseLoader loading={cargando} color="rgb(113, 50, 255)" size={10} />
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
                                            >Transacción</th>
                                            <th className={(dark === "light" ?
                                                "text-center py-2 px-10 font-semibold text-violet-600 text-sm"
                                                : "text-center py-2 px-10 font-semibold text-violet-400 text-sm"
                                            )}
                                            >Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomes?.map((transaccion, index) => {
                                            return (
                                                <tr className=" border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-10 text-gray-800 font-semibold text-sm"
                                                        : "text-gray-100 font-semibold py-2 px-10 text-sm"
                                                    )}>{transaccion.detalle}</td>
                                                    <td className="py-2 px-10 text-green-500 font-semibold font-mono text-sm">
                                                        <div className="w-28 flex justify-center rounded-md bg-green-300">
                                                            +${parseFloat(transaccion.monto).toFixed(2)}
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
                            type={type.INGRESO}
                            setLoading={setLoading}
                            metadata={metadata}
                            setMetadata={setMetadata}
                        />
                    </div> : <div></div>
            }
        </div>
    );
};