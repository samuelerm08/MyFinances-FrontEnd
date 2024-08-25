import { useState } from "react";
import { getCategories } from "../../services/myfinances-api/category";
import { useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { getDollarExchangeRate } from "../../services/dollar/dollar-api";
import { currency, texts } from "../../constants/myfinances-constants";
import useDark from "../../context/useDark";
import TransactionPopUp from "../pop-ups/TransactionPopUp";

export const BalanceSection = ({ auth, setTransactions, balance, setBalance }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [dollarValue, setDollarValue] = useState(null);
    const [dollarDate, setDollarDate] = useState(null);
    const [currentCurrency, setCurrency] = useState("ARS");
    const { dark } = useDark();

    const handleTransactionPopUp = () => {
        setPopUp(true);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data: response } = await getCategories(config);
                const validCategories = response?.filter(({ title }) => !title.includes("Reserve"));
                setCategories(validCategories);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        const fetchDollars = async () => {
            const { data } = await getDollarExchangeRate();
            setDollarValue(data.blue.value_sell);
            setDollarDate(data.last_update);
        };
        fetchCategories();
        fetchDollars();
    }, []);
    return (
        <div className={(dark === "light" ?
            "bg-gray-200 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 w-full m-2 flex flex-col justify-around "
            : "bg-gray-600 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 w-full m-2 flex flex-col justify-around "
        )}>
            {
                loading ?
                    <div className="flex justify-center items-center h-full">
                        <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                    </div>
                    :
                    balance ?
                        <div className='flex flex-col p-5 justify-center text-center'>
                            <div>
                                <div className="flex justify-end">
                                    <div>
                                        <select
                                            className={`${currentCurrency === currency.ARS ?
                                                "font-semibold text-black bg-blue-200 shadow-md hover:shadow-blue-400" :
                                                "font-semibold text-black bg-green-200 shadow-md hover:shadow-green-400"}`}
                                            name="currentCurrency"
                                            id="currentCurrency"
                                            value={currentCurrency}
                                            onChange={e => setCurrency(e.target.value)}
                                        >
                                            <option className="font-semibold" value="ARS">ARS</option>
                                            <option className="font-semibold" value="USD">USD</option>
                                        </select>
                                    </div>
                                </div>
                                <h3 className={(dark === "light" ?
                                    "text-xl font-semibold text-violet-600 antialiased"
                                    : "text-xl font-semibold text-violet-400 antialiased"
                                )}
                                >
                                    Balance
                                </h3>
                                {
                                    !balance?.totalBalance ?
                                        <h1 className={(dark === "light" ?
                                            "text-gray-600 font-bold text-5xl font-mono"
                                            : "text-gray-200 font-bold text-5xl font-mono"
                                        )}
                                        >
                                            <span className="mr-1">$</span>
                                            {parseFloat(0).toFixed(2)}
                                        </h1> :
                                        currentCurrency === currency.ARS
                                            ?
                                            balance?.totalBalance < 0 ?
                                                <h1 className='text-red-500 font-bold text-5xl font-mono'>
                                                    <span className="mr-1">$</span>
                                                    {parseFloat(balance?.totalBalance).toFixed(2)}
                                                </h1> :
                                                <h1 className={(dark === "light" ?
                                                    "text-gray-600 font-bold text-5xl font-mono"
                                                    : "text-gray-200 font-bold text-5xl font-mono"
                                                )}
                                                >
                                                    <span className="mr-1">$</span>
                                                    {parseFloat(balance?.totalBalance).toFixed(2)}
                                                </h1> :
                                            currentCurrency === currency.USD
                                                ?
                                                balance?.totalBalance < 0 ?
                                                    <h1 className='text-red-500 font-bold text-5xl font-mono'>
                                                        <span className="mr-1">U$S</span>
                                                        {parseFloat(balance?.totalBalance / dollarValue).toFixed(2)}
                                                    </h1> :
                                                    <h1 className={(dark === "light" ?
                                                        "text-gray-600 font-bold text-5xl font-mono"
                                                        : "text-gray-200 font-bold text-5xl font-mono"
                                                    )}>
                                                        <span className="mr-1">U$S</span>
                                                        {parseFloat(balance?.totalBalance / dollarValue).toFixed(2)}
                                                    </h1>
                                                :
                                                <div className="flex justify-center">
                                                    <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                                                </div>
                                }
                                <br />
                                {
                                    !!dollarValue && !!dollarDate ?
                                        <div className={(dark === "light" ?
                                            "text-center rounded-2xl p-3 m-3 bg-green-100 shadow-md hover:shadow-green-400"
                                            : "text-center rounded-2xl p-3 m-3 bg-green-200 shadow-md hover:shadow-green-400"
                                        )}>
                                            <div className="flex flex-col items-center font-semibold mb-4 text-violet-600">
                                                <h3 className="w-24 text-white shadow-md font-semibold text-center rounded-3xl bg-green-400 font-mono">
                                                    <span className="mr-1">ARS</span>
                                                    {dollarValue}
                                                </h3>
                                            </div>
                                            <div className="flex flex-col items-center font-bold text-green-500 mt-4">
                                                <h3>Dollar rate</h3>
                                                <h3>{new Date(dollarDate).toLocaleDateString()}</h3>
                                            </div>
                                        </div> :
                                        <div></div>
                                }
                            </div>
                        </div> :
                        <div className='pt-14 flex flex-col p-5 items-center text-center' >
                            <h3 className={(dark === "light" ?
                                "mb-10 text-lg text-center mt-20 text-black" :
                                "mb-10 text-lg text-center mt-20 text-white")}>
                                {texts.WITH_NO_TRANSACTIONS}
                            </h3>
                        </div>
            }
            {
                !loading ?
                    <div className="flex justify-center pb-5">
                        <button
                            type="button"
                            className='text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold p-absolute shadow-md hover:shadow-violet-500'
                            onClick={handleTransactionPopUp}
                        >
                            New Transaction
                        </button>

                        {
                            popUp &&
                            <TransactionPopUp
                                setPopUp={setPopUp}
                                animate={animate}
                                setAnimate={setAnimate}
                                categories={categories}
                                setTransactions={setTransactions}
                                setBalance={setBalance}
                                balance={balance}
                            />
                        }
                    </div>
                    : <div></div>
            }
        </div>
    );
};