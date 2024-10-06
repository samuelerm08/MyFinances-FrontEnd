import { HttpStatusCode } from "axios";
import { amountReGex } from "../../../constants/MyFinancesConstants";
import useAuth from "../../../context/UseAuth";
import useDark from "../../../context/UseDark";
import { filterTransactions } from "../../../services/myfinances-api/Transaction";
import { getUserToken } from "../../../services/token/TokenService";

export const AmountFilter = ({
    setLoading,
    setAlert,
    setCurrentPage,
    setTransactions,
    setMetadata,
    setPayloadProps,
    setAmount,
    amount,
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
    const handleAmountChange = async (amount) => {
        setLoading(true);
        setAmount(amount);
        setPayloadProps({
            ...payloadProps,
            userId: user.id,
            amountUpTo: amount
        });
        const payload = {
            ...payloadProps,
            userId: user.id,
            amountUpTo: amount
        };
        try {
            const { data: response, status } = await filterTransactions(payload, 1, 10, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setCurrentPage(1);
                setTransactions(response.data);
                setMetadata(response.meta);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setTransactions([]);
            setMetadata({});
            setPayloadProps({
                ...payloadProps,
                userId: user.id,
                amountUpTo: null
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
                >Amount Up To</label>
                <input
                    id="amount"
                    type="text"
                    className={(dark === "light" ?
                        "bg-[#E5E7EB] rounded-md p-1 font-mono text-black"
                        : "bg-gray-600 rounded-md p-1 font-mono text-white"
                    )}
                    placeholder="Enter amount"
                    value={amount.replace(",", ".")}
                    onChange={e => {
                        if (e.target.value === "" || amountReGex.test(e.target.value.replace(",", "."))) {
                            handleAmountChange(e.target.value);
                        }
                    }}
                />
            </div>
        </div>
    );
};