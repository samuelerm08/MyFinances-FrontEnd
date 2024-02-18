import { PulseLoader } from "react-spinners";
import { texts, type } from "../../../constants/myfinances-constants";
import useDark from "../../../context/useDark";

export const ExpensesSection = ({ cargando, transacciones }) => {
    const egresos = transacciones?.filter(({ tipoTransaccion }) => tipoTransaccion === type.EGRESO);
    const { dark } = useDark();

    return (
        <div className={(dark === "light" ?
            "bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-violet-400 m-2 h-[400px]"
            : "bg-gray-600 p-4 rounded-lg shadow-md hover:shadow-violet-400 m-2 h-[400px]"
        )}>

            <div>
                <h2 className={(dark === "light" ?
                    "font-bold text-center p-1 text-violet-600"
                    :
                    "font-bold text-center p-1 text-violet-400"
                )}>Ultimos Gastos</h2>
                <div className="bg-inherit rounded-lg mb-5">
                    {cargando ?
                        <div className="flex justify-center">
                            <PulseLoader loading={cargando} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        !!egresos?.length
                            ?
                            <div className="flex justify-center">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className={(dark === "light" ?
                                                "font-bold text-center py-2 px-10 text-violet-600"
                                                :
                                                "font-bold text-center py-2 px-10 text-violet-400"
                                            )}>Transacción</th>
                                            <th className={(dark === "light" ?
                                                "font-bold text-center py-2 px-10 text-violet-600"
                                                :
                                                "font-bold text-center py-2 px-10 text-violet-400"
                                            )}>Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {egresos?.slice(0, 5).map((transaccion, index) => {
                                            return (
                                                <tr className="border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "text-gray-600 text-sm py-2 px-10 font-bold"
                                                        :
                                                        "text-gray-300 text-sm py-2 px-10 font-bold"
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
                            <div className='pt-14 flex flex-col p-5 items-center text-center' >
                                <h3 className={(dark === "light" ?
                                    "text-lg text-center text-black" :
                                    "text-lg text-center text-white")}>
                                    {texts.WITH_NO_EXPENSES}
                                </h3>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};