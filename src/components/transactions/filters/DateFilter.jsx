import useAuth from "../../../context/UseAuth";
import { getUserToken } from "../../../services/token/TokenService";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import en from "date-fns/locale/en-US";
import { filterTransactions } from "../../../services/myfinances-api/Transaction";
import useDark from "../../../context/UseDark";
import { HttpStatusCode } from "axios";

export const DateFilter = ({
    setTransactions,
    setAlert,
    setLoading,
    setMetadata,
    date,
    setDate,
    setCurrentPage,
    setPayloadProps,
    payloadProps
}) => {
    const { auth } = useAuth();
    const { dark } = useDark();

    const user = getUserToken();
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };
    const handleDateChange = async (date) => {
        setLoading(true);
        setPayloadProps({
            ...payloadProps,
            userId: user.id,
            date: date
        });
        const payload = {
            ...payloadProps,
            userId: user.id,
            date: date
        };
        try {
            const { data: response, status } = await filterTransactions(payload, 1, 10, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setCurrentPage(1);
                setTransactions(response.data);
                setMetadata(response.meta);
                setDate(payload.date);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setDate("");
            setMetadata({});
            setTransactions([]);
            setPayloadProps({
                ...payloadProps,
                userId: user.id,
                date: null
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
        <div className="flex flex-col mx-2 font-mono font-sm text-left p-2">
            <label className={(dark === "light" ?
                "font-semibold text-violet-600"
                : "font-semibold text-violet-400"
            )}
            >Date</label>
            <ReactDatePicker
                showIcon
                locale={en}
                className={(dark === "light" ?
                    "bg-[#E5E7EB] rounded-md p-1 font-mono text-black"
                    : "bg-gray-600 rounded-md p-1 font-mono text-white"
                )}
                value={date}
                placeholderText="Filter by date"
                onChange={(date) => handleDateChange(date.toISOString().split("T")[0])}
            />
        </div>
    );
};