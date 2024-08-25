import { HttpStatusCode } from "axios";
import useAuth from "../../../context/useAuth";
import useDark from "../../../context/useDark";
import { filterTransactions } from "../../../services/myfinances-api/transaction";
import { getUserToken } from "../../../services/token/tokenService";

export const StateFilter = ({
    setLoading,
    setAlert,
    setCurrentPage,
    setTransactions,
    setMetadata,
    setPayloadProps,
    setState,
    state,
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
    const handleStateChange = async (state) => {
        setLoading(true);
        setPayloadProps({
            ...payloadProps,
            userId: user.id,
            isActive: state
        });
        const payload = {
            ...payloadProps,
            userId: user.id,
            isActive: state
        };
        try {
            const { data: response, status } = await filterTransactions(payload, 1, 10, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setCurrentPage(1);
                setTransactions(response.data);
                setMetadata(response.meta);
                setState(state);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setState("");
            setTransactions([]);
            setMetadata({});
            setPayloadProps({
                ...payloadProps,
                userId: user.id,
                isActive: null
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
                >State</label>
                <select
                    name="estado"
                    id="estado"
                    className={(dark === "light" ?
                        "bg-[#E5E7EB] rounded-md p-1 font-mono text-black"
                        : "bg-gray-600 text-gray-400 font-semibold rounded-md p-1 font-mono text-white"
                    )}
                    value={state}
                    onChange={e => handleStateChange(e.target.value)}
                >
                    <option defaultValue={""} value="">None</option>
                    <option value={true}>Active</option>
                    <option value={false}>Canceled</option>
                </select>
            </div>
        </div>
    );
};