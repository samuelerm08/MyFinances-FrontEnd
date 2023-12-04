import { PulseLoader } from "react-spinners";
import { type } from "../../constants/myfinances-constants";

export const BalanceExpenses = ({ cargando, transacciones }) => {
    const egresos = transacciones?.filter(({ tipoTransaccion }) => tipoTransaccion === type.EGRESO);
    return (
        <div className="bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-violet-400 mx-2">
            <div>
                <h2 className='p-1 text-center font-semibold justify-around text-violet-600'>Gastos</h2>
                <div className="bg-inherit rounded-lg  border">
                    {cargando ?
                        <div className="flex justify-center">
                            <PulseLoader loading={cargando} color="rgb(113, 50, 255)" size={10} />
                        </div> :
                        <div className="flex justify-center">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="text-center py-2 px-10 font-semibold text-violet-600">Transacción</th>
                                        <th className="text-center py-2 px-10 font-semibold text-violet-600">Monto</th>
                                        <th className="text-center py-2 px-10 font-semibold text-violet-600">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {egresos?.map((transaccion, index) => {
                                        return (
                                            <tr className="border-b border-gray-200" key={index}>
                                                <td className="py-2 px-10">{transaccion.detalle}</td>
                                                <td className="py-2 px-10 text-red-500 font-semibold font-mono">
                                                    <div className="w-28 flex justify-center">
                                                        -${parseFloat(transaccion.monto).toFixed(2)}
                                                    </div>
                                                </td>
                                                {
                                                    !transaccion.estaActiva ?
                                                        <td className="py-2 px-10 text-orange-400 font-semibold">
                                                            <div className="w-24 text-center rounded-md bg-orange-200">
                                                                Anulada
                                                            </div>
                                                        </td> :
                                                        <td className="py-2 px-10 text-green-500 font-semibold">
                                                            <div className="w-24 text-center rounded-md bg-green-200">
                                                                Activa
                                                            </div>
                                                        </td>
                                                }
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>}
                </div>
            </div>
        </div>
    );
};