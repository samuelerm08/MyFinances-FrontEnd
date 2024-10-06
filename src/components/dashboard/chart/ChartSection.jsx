import { PulseLoader } from "react-spinners";
import { ExpensesChart } from "./ExpensesChart";
import { texts, type } from "../../../constants/MyFinancesConstants";
import useDark from "../../../context/UseDark";

export const ChartSection = ({ loading, transactions }) => {
    const filteredExpenses = transactions?.filter(({ transactionType }) => transactionType === type.EXPENSE);

    const { dark } = useDark();

    return (
        <div className={(dark === "light" ?
            "bg-gray-200 pt-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 w-full m-2 flex flex-col justify-around"
            : "bg-gray-600 pt-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 w-full m-2 flex flex-col justify-around"
        )}
        >
            {
                loading ?
                    <div className="flex justify-center">
                        <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                    </div> :
                    filteredExpenses?.length ?
                        <div className="w-full flex justify-center">
                            <div>
                                <div>
                                    <div className="flex justify-center">
                                        <h2 className={(dark === "light" ?
                                            "text-xl font-semibold text-violet-600"
                                            : "text-xl font-semibold text-violet-400"
                                        )}
                                        >
                                            Last Expenses
                                        </h2>
                                    </div>
                                    <ExpensesChart expenses={filteredExpenses.splice(0, 5)} />
                                </div>
                            </div>
                        </div> :
                        <h3 className={(dark === "light" ?
                            "mb-10 text-lg text-center mt-20 text-black" :
                            "mb-10 text-lg text-center mt-20 text-white")}>
                            {texts.NO_CHART}
                        </h3>
            }
        </div>
    );
};