import { PulseLoader } from "react-spinners";
import { texts, type } from "../../../constants/myfinances-constants";
import useDark from "../../../context/useDark";
import Alerta from "../../Alerta";

export const ReservesSection = ({ cargando, transacciones }) => {
    const reserves = transacciones?.filter(({ tipoTransaccion }) => tipoTransaccion === type.RESERVA);
    const { dark } = useDark();

    return (
        <div className={(dark === "light" ?
            "bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-violet-400 m-2"
            : "bg-gray-600 p-4 rounded-lg shadow-md hover:shadow-violet-400 m-2"
        )}
        >
            <div>
                <h2 className={(dark === "light" ?
                    "p-1 text-center font-semibold text-violet-600"
                    : "p-1 text-center font-semibold text-violet-400"
                )}
                >Últimas Reservas</h2>
                <div className="bg-inherit rounded-lg">
                    {cargando ?
                        <div className="flex justify-center">
                            <PulseLoader loading={cargando} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        reserves
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
                                        {reserves?.slice(0, 5).map((transaccion, index) => {
                                            return (
                                                <tr className=" border-gray-200" key={index}>
                                                    <td className={(dark === "light" ?
                                                        "text-gray-600 py-2 px-10 font-bold"
                                                        :
                                                        "text-gray-300 py-2 px-10 font-bold"
                                                    )}>{transaccion.detalle}</td>

                                                    {
                                                        transaccion.detalle?.includes("Retiro") ?
                                                            <td className="py-2 px-10 text-green-500 font-semibold font-mono">
                                                                <div className="w-28 flex justify-center rounded-md bg-green-200">
                                                                    +${parseFloat(transaccion.monto).toFixed(2)}
                                                                </div>
                                                            </td> :
                                                            <td className="py-2 px-10 text-red-500 font-semibold font-mono">
                                                                -${parseFloat(transaccion.monto).toFixed(2)}
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