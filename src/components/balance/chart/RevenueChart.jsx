import {
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Chart as ChartJS,
    Title
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { texts, type } from "../../../constants/myfinances-constants";
import useDark from "../../../context/useDark";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export const RevenueChart = ({ transactions }) => {
    const { dark } = useDark();
    const activeTransactions = transactions?.filter(({ isActive }) => isActive);

    const sumAmounts = (activeTransactions) => {

        const amounts = {
            incomes: { incomes: 0 },
            expenses: { expenses: 0 }
        };
        activeTransactions?.forEach((transaction) => {
            const amount = transaction?.amount;
            const isReserve = transaction.transactionType === type.RESERVE;
            const isWithdraw = isReserve && transaction?.details?.includes("Withdraw");
            const isIncome = transaction.transactionType === type.INCOME || isWithdraw;
            const isExpense = transaction.transactionType === type.EXPENSE || !isWithdraw;

            if (isIncome) amounts[texts.INCOMES].incomes += amount;
            else if (isExpense) amounts[texts.EXPENSES].expenses += amount;
        });
        const amountsArray = Object.values(amounts);
        return amountsArray;
    };

    const totalAmounts = sumAmounts(activeTransactions);
    const totalIncomes = totalAmounts.map(({ incomes }) => incomes);
    const totalExpenses = totalAmounts.map(({ expenses }) => expenses);
    const totalSaved = totalAmounts[0]?.incomes - totalAmounts[1]?.expenses;

    const colors = [
        "#22C55E",
        "#EF4444"
    ];

    return (
        <div className={(dark === "light" ?
            "bg-gray-200 rounded-lg px-6 mt-6 mb-60 p-10 shadow-md hover:shadow-violet-400"
            :
            "bg-gray-600 rounded-lg px-6 mt-6 mb-60 p-10 shadow-md hover:shadow-violet-400"
        )}
        >
            <h3 className={(dark === "light" ?
                "text-xl text-center font-semibold text-violet-600 antialiased"
                : "text-xl text-center font-semibold text-violet-400 antialiased"
            )}>
                Saved
                <i className="fa-solid fa-circle-question ml-2 text-gray-400"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Saved last 10 transactions">
                </i>
                {
                    totalSaved?.toFixed(2) > 0 ?
                        <p className="text-green-400">
                            ${totalSaved?.toFixed(2)}
                        </p> :
                        <p className="text-red-500">
                            ${totalSaved?.toFixed(2)}
                        </p>
                }
            </h3>

            <h3 className={(dark === "light" ?
                "text-xl text-center font-semibold text-violet-600 antialiased"
                : "text-xl text-center font-semibold text-violet-400 antialiased"
            )}>
            </h3>

            <div className="chart-container">
                <Bar
                    width={600} height={250}
                    color={dark === "light" ? "white" : "black"}
                    data={{
                        labels: ["Incomes", "Expenses"],
                        datasets: [
                            {
                                label: "Incomes",
                                data: totalIncomes,
                                backgroundColor: colors[0],
                                borderWidth: 0,
                                hoverOffset: 15,
                                borderRadius: 10,
                                barPercentage: 1,
                                categoryPercentage: 0.5
                            },
                            {
                                label: "Expenses",
                                data: totalExpenses,
                                backgroundColor: colors[1],
                                borderWidth: 0,
                                hoverOffset: 15,
                                borderRadius: 10,
                                barPercentage: 1,
                                categoryPercentage: 0.5
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        color: dark === "light" ? "black" : "white",
                        scales: {
                            x: {
                                ticks: {
                                    color: dark === "light" ? "#4B5563" : "white",
                                    font: {
                                        size: 12,
                                        weight: 500,
                                        family: "Consolas"
                                    }
                                },
                                grid: {
                                    color: dark === "light" ? "#E5E7EB" : "#4B5563"
                                }
                            },
                            y: {
                                ticks: {
                                    color: dark === "light" ? "#4B5563" : "white",
                                    font: {
                                        size: 12,
                                        weight: 500,
                                        family: "Consolas"
                                    }
                                },
                                grid: {
                                    color: dark === "light" ? "#4B5563" : "gray"
                                }
                            }
                        },
                        layout: {
                            padding: 1
                        },
                        plugins: {
                            title: "",
                            legend: {
                                display: true,
                                position: "bottom",
                                align: "center",
                                labels: {
                                    font: {
                                        size: 12,
                                        weight: 500,
                                        family: "Consolas"
                                    },
                                    color: dark === "light" ? "#4B5563" : "white",
                                    boxWidth: 8,
                                    boxHeight: 8,
                                    usePointStyle: true,
                                    pointStyle: "circle"
                                }
                            }
                        }
                    }}
                >
                </Bar>
            </div>
        </div>
    );
};
