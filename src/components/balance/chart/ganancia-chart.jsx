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
import { type } from "../../../constants/myfinances-constants";
import useDark from "../../../context/useDark";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export const GananciaChart = ({ transacciones }) => {
    const { dark } = useDark();
    const transaccionesActivas = transacciones?.filter(({ estaActiva }) => estaActiva);

    const sumarMontos = (transaccionesActivas) => {
        const amountsByMonth = {};

        transaccionesActivas?.forEach((transaccion) => {

            const fecha = new Date(transaccion.fecha);
            const month = fecha.toLocaleString("es-ES", { month: "long", year: "numeric" });
            const amont = transaccion.monto;
            const isReserve = transaccion.tipoTransaccion === type.RESERVA;
            const isWithdraw = isReserve && transaccion?.detalle?.includes("Retiro");
            const isIncome = transaccion.tipoTransaccion === type.INGRESO || isWithdraw;
            const isExpense = transaccion.tipoTransaccion === type.EGRESO || !isWithdraw;

            if (!amountsByMonth[month]) {
                amountsByMonth[month] = { month: month, incomes: 0, expenses: 0 };
            }

            if (isIncome)
                amountsByMonth[month].incomes += amont;
            else if (isExpense)
                amountsByMonth[month].expenses += amont;
        });

        const amountsArray = Object.values(amountsByMonth);
        return amountsArray;
    };
    const totalAmounts = sumarMontos(transaccionesActivas);
    const sortedAmounts = totalAmounts.sort((a, b) => {
        const fechaA = new Date(a.mes);
        const fechaB = new Date(b.mes);
        return fechaA - fechaB;
    });

    const totalDates = sortedAmounts.map(({ month }) => month);
    const totalIncomes = totalAmounts.map(({ incomes }) => incomes);
    const totalExpenses = totalAmounts.map(({ expenses }) => expenses);
    const totalSaved = totalIncomes - totalExpenses;

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
                Total Ahorrado
                <i className="fa-solid fa-circle-question ml-2 text-gray-400"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Ahorrado en las últimas 10 transacciones">
                </i>
            </h3>

            <h3 className={(dark === "light" ?
                "text-xl text-center font-semibold text-violet-600 antialiased"
                : "text-xl text-center font-semibold text-violet-400 antialiased"
            )}>
                ${totalSaved.toFixed(2)}
            </h3>

            <div className="chart-container">
                <Bar
                    width={500} height={250}
                    color={dark === "light" ? "white" : "black"}
                    data={{
                        labels: totalDates,
                        datasets: [
                            {
                                label: "Ingresos",
                                data: totalIncomes,
                                backgroundColor: colores[0], // Color para ingresos
                                borderWidth: 0,
                                hoverOffset: 15,
                                borderRadius: 15
                            },
                            {
                                label: "Egresos",
                                data: totalExpenses,
                                backgroundColor: colores[1], // Color para egresos
                                borderWidth: 0,
                                hoverOffset: 15,
                                borderRadius: 15,
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
