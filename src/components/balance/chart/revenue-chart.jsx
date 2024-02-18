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

export const RevenueChart = ({ transacciones }) => {
    const { dark } = useDark();
    const transaccionesActivas = transacciones?.filter(({ estaActiva }) => estaActiva);

    const sumAmounts = (transaccionesActivas) => {

        const amounts = {
            incomes: { incomes: 0 },
            expenses: { expenses: 0 }
        };
        transaccionesActivas?.forEach((transaccion) => {
            const amount = transaccion?.monto;
            const isReserve = transaccion.tipoTransaccion === type.RESERVA;
            const isWithdraw = isReserve && transaccion?.detalle?.includes("Retiro");
            const isIncome = transaccion.tipoTransaccion === type.INGRESO || isWithdraw;
            const isExpense = transaccion.tipoTransaccion === type.EGRESO || !isWithdraw;

            if (isIncome) {
                amounts[texts.INCOMES].incomes += amount;
            } else if (isExpense) {
                amounts[texts.EXPENSES].expenses += amount;
            }
        });
        const amountsArray = Object.values(amounts);
        return amountsArray;
    };

    const totalAmounts = sumAmounts(transaccionesActivas);
    const totalIncomes = totalAmounts.map(({ incomes }) => incomes);
    const totalExpenses = totalAmounts.map(({ expenses }) => expenses);
    const totalAhorrado = totalAmounts[0]?.incomes - totalAmounts[1]?.expenses;

    const colores = [
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
                Ahorrado
                <i className="fa-solid fa-circle-question ml-2 text-gray-400"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Ahorrado en las últimas 10 transacciones">
                </i>
                {
                    totalAhorrado?.toFixed(2) > 0 ?
                        <p className="text-green-400">
                            ${totalAhorrado?.toFixed(2)}
                        </p> :
                        <p className="text-red-500">
                            ${totalAhorrado?.toFixed(2)}
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
                        labels: ["Ingresos", "Egresos"],
                        datasets: [
                            {
                                label: "Ingresos",
                                data: totalIncomes,
                                backgroundColor: colores[0], // Color para ingresos
                                borderWidth: 0,
                                hoverOffset: 15,
                                borderRadius: 10,
                                barPercentage: 1,
                                categoryPercentage: 0.5
                            },
                            {
                                label: "Egresos",
                                data: totalExpenses,
                                backgroundColor: colores[1], // Color para egresos
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
