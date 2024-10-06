import { HttpStatusCode } from "axios";
import useAuth from "../../../context/UseAuth";
import useDark from "../../../context/UseDark";
import { filterTransactions } from "../../../services/myfinances-api/Transaction";
import { getUserToken } from "../../../services/token/TokenService";

export const TypeFilter = ({
    setLoading,
    setAlert,
    setCurrentPage,
    setTransactions,
    setMetadata,
    setPayloadProps,
    setType,
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
                setTransactions(response.data);
                setMetadata(response.meta);
                setType(type);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setType("");
            setTransactions([]);
            setMetadata({});
            setPayloadProps({
                ...payloadProps,
                userId: user.id,
                transactionType: null
            });
            setAlert({
                msg: error.response.data,
                error: true
            });
            setTimeout(() => {
                setAlert({});
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
                    <option defaultValue={""} value="">None</option>
                    <option value="Income">Income</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Reserve">Reserve</option>
                </select>
            </div>
        </div>
    );
};