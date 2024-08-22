import { HttpStatusCode } from "axios";
import useAuth from "../../../context/useAuth";
import useDark from "../../../context/useDark";
import { filterTransactions } from "../../../services/myfinances-api/transaction";
import { getUserToken } from "../../../services/token/tokenService";

export const TypeFilter = ({
    setLoading,
    setAlerta,
    setCurrentPage,
    setTransacciones,
    setMetadata,
    setPayloadProps,
    setTipo,
    transactionType,
    payloadProps
}) => {
    const { auth } = useAuth();
    const user = getUserToken();
    const { dark } = useDark();

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };
    const handleTypeChange = async (type) => {
        setLoading(true);
        setPayloadProps({
            ...payloadProps,
            userId: user.id,
            transactionType: type
        });
        const payload = {
            ...payloadProps,
            userId: user.id,
            transactionType: type
        };
        try {
            const { data: response, status } = await filterTransactions(payload, 1, 10, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setCurrentPage(1);
                setTransacciones(response.data);
                setMetadata(response.meta);
                setTipo(type);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setTipo("");
            setTransacciones([]);
            setMetadata({});
            setPayloadProps({
                ...payloadProps,
                userId: user.id,
                transactionType: null
            });
            setAlerta({
                msg: error.response.data,
                error: true
            });
            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }
    };
    return (
        <div className='flex flex-col mx-2'>
            <div className="field flex flex-col font-mono font-sm text-left p-2">
                <label className={(dark === "light" ?
                    "font-semibold text-violet-600"
                    : "font-semibold text-violet-400"
                )}
                >Type</label>
                <select
                    name="transactionType"
                    id="transactionType"
                    className={(dark === "light" ?
                        "bg-[#E5E7EB] rounded-md p-1 font-mono text-black"
                        : "bg-gray-600 text-gray-400 font-semibold rounded-md p-1 font-mono text-white"
                    )}
                    value={transactionType}
                    onChange={e => handleTypeChange(e.target.value)}
                >
                    <option defaultValue={""} value="">Ninguno</option>
                    <option value="Ingreso">Ingreso</option>
                    <option value="Egreso">Egreso</option>
                    <option value="Reserva">Reserva</option>
                </select>
            </div>
        </div>
    );
};