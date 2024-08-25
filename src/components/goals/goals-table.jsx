import useDark from "../../context/useDark";
import { PulseLoader } from "react-spinners";

export const GoalsTable = ({
    loading,
    tableGoals
}) => {
    const { dark } = useDark();
    return (
        <div className="t-table">
            {
                !!loading ?
                    <div className="flex justify-center items-center h-full">
                        <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                    </div>
                    :
                    <div className="flex flex-col justify-center">
                        <table className={(dark === "light" ?
                            "w-full"
                            :
                            "bg-gray-600 w-full"
                        )}
                        >
                            <thead>
                                <tr>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-4 font-semibold text-violet-600"
                                        :
                                        "text-left py-2 px-4 font-semibold text-violet-400"
                                    )}
                                    >Goal</th>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-4 font-semibold text-violet-600"
                                        :
                                        "text-left py-2 px-4 font-semibold text-violet-400"
                                    )}
                                    >Current Amount</th>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-4 font-semibold text-violet-600"
                                        :
                                        "text-left py-2 px-4 font-semibold text-violet-400"
                                    )}
                                    >Final Amount</th>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-4 font-semibold text-violet-600"
                                        :
                                        "text-left py-2 px-4 font-semibold text-violet-400"
                                    )}
                                    >Progress</th>
                                    <th className={(dark === "light" ?
                                        "text-left py-2 px-4 font-semibold text-violet-600"
                                        :
                                        "text-left py-2 px-4 font-semibold text-violet-400"
                                    )}
                                    >State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableGoals?.slice(0, 10).map((goal, index) => {
                                    return (
                                        <tr className={(dark === "light" ?
                                            "border-b border-gray-200 "
                                            :
                                            "border-b border-gray-500 "
                                        )}
                                            key={index}>
                                            <td className={(dark === "light" ?
                                                "py-2 px-4 text-gray-800 font-semibold font-mono"
                                                :
                                                "py-2 px-4 text-gray-200 font-semibold font-mono"
                                            )}
                                            >{goal.title}</td>
                                            {
                                                !goal.currentAmount ?
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-4 text-gray-400 font-semibold font-mono"
                                                        :
                                                        "py-2 px-4 text-gray-300 font-semibold font-mono"
                                                    )}>
                                                        ${parseFloat(0).toFixed(2)}
                                                    </td> :
                                                    <td className={(dark === "light" ?
                                                        "py-2 px-4 text-gray-400 font-semibold font-mono"
                                                        :
                                                        "py-2 px-4 text-gray-300 font-semibold font-mono"
                                                    )}>
                                                        ${parseFloat(goal.currentAmount).toFixed(2)}
                                                    </td>
                                            }
                                            <td className={(dark === "light" ?
                                                "py-2 px-4 text-gray-400 font-semibold font-mono"
                                                :
                                                "py-2 px-4 text-gray-300 font-semibold font-mono"
                                            )}>
                                                ${parseFloat(goal.finalAmount).toFixed(2)}
                                            </td>
                                            <td className={(dark === "light" ?
                                                "py-2 px-4 text-gray-400 font-semibold font-mono"
                                                :
                                                "py-2 px-4 text-gray-300 font-semibold font-mono"
                                            )}>
                                                {`${((goal.currentAmount / goal.finalAmount) * 100).toFixed(2)}%`}
                                            </td>

                                            {
                                                goal.completed ?
                                                    !goal.withdrawn ?
                                                        <td className="py-2 px-4  text-green-500 font-semibold font-mono">
                                                            Completed
                                                            <span className={(dark === "light" ?
                                                                "py-2 px-1 text-gray-800 pointer-events-none font-mono"
                                                                :
                                                                "py-2 px-1 text-gray-200 pointer-events-none font-mono"
                                                            )}>
                                                                <i className="fa-solid fa-check text-sm"></i>
                                                            </span>
                                                        </td> :
                                                        <td className="py-2 px-4 text-gray-400 font-semibold font-mono">
                                                            Withdrawn
                                                            <span className={(dark === "light" ?
                                                                "py-2 px-2 text-gray-800 pointer-events-none font-mono"
                                                                :
                                                                "py-2 px-2 text-gray-200 pointer-events-none font-mono"
                                                            )}>
                                                                <i className="fa-solid fa-arrow-up-from-bracket text-sm"></i>
                                                            </span>
                                                        </td> :
                                                    <td className="py-2 px-4 font-semibold font-mono text-orange-400">
                                                        In Progress
                                                        <span className={(dark === "light" ?
                                                            "py-2 px-1 text-gray-800 pointer-events-none font-mono"
                                                            :
                                                            "py-2 px-1 text-gray-200 pointer-events-none font-mono"
                                                        )}>
                                                            <i className="fa-solid fa-clock text-sm"></i>
                                                        </span>
                                                    </td>
                                            }
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
            }
        </div >
    );
};