import { PulseLoader } from "react-spinners";
import useDark from "../../context/UseDark";
import useAuth from "../../context/UseAuth";
import { getByState, withdrawGoal } from "../../services/myfinances-api/FinancialGoal";
import { texts } from "../../constants/MyFinancesConstants";
import { useState } from "react";
import { HttpStatusCode } from "axios";
import { getUserToken } from "../../services/token/TokenService";

export const CompletedGoals = ({
    goals,
    error,
    loading,
    completedGoalsMetadata,
    setCompletedGoalsMetadata,
    setCompletedGoals,
    setTableGoals,
    setAlert
}) => {
    const { dark } = useDark();
    const { auth } = useAuth();
    const [goalError, setError] = useState(null);
    const [goalLoading, setGoalLoading] = useState(false);
    const completedGoals = goals?.filter(({ completed, withdrawn }) => completed && !withdrawn);
    const user = getUserToken();

    const handleGoalWithdrawal = async (goalId) => {
        setGoalLoading({
            ...goalLoading,
            [goalId]: true
        });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            }
        };
        try {
            const { data, status } = await withdrawGoal(goalId, config);
            if (status === HttpStatusCode.Ok) {
                setGoalLoading({
                    ...goalLoading,
                    [goalId]: false
                });
                setAlert({
                    msg: texts.ON_WITHDRAWN_GOAL,
                    error: false
                });
                setTimeout(() => {
                    setAlert({});
                }, 1500);
                setTimeout(async () => {
                    setCompletedGoals(completedGoals => completedGoals.map((goal) => {
                        return goalId === goal.id ? { ...goal, withdrawn: data.withdrawn } : goal;
                    }));
                    setTableGoals(tableGoals => tableGoals.map((goal) => {
                        return goalId === goal.id ? { ...goal, withdrawn: data.withdrawn } : goal;
                    }));
                    const payload = {
                        userId: user.id,
                        completed: true
                    };

                    let page = completedGoalsMetadata?.page ?? 1;
                    const resetPageEnabled =
                        page !== 1 &&
                        (
                            !completedGoalsMetadata?.hasNextPage &&
                            completedGoals?.length === 1
                        );

                    if (resetPageEnabled) {
                        page = page - 1;
                    }
                    const { data: response, status } = await getByState(payload, page, 4, config);
                    if (status === HttpStatusCode.Ok) {
                        setCompletedGoals(response.data);
                        setCompletedGoalsMetadata(response.meta);
                    }
                }, 500);
            }
        } catch (error) {
            setGoalLoading({
                ...goalLoading,
                [goalId]: false
            });
            setError(error);
        }
    };
    return (
        <div className="t-table">
            <h3 className={(dark === "light" ?
                "text-xl font-semibold text-violet-600 antialiased"
                : "text-xl font-semibold text-violet-400 antialiased"
            )}>Completed Goals</h3>
            {
                !!loading ?
                    <div className="flex justify-center items-center h-full">
                        <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                    </div> :
                    !!goals?.length || (!!goals?.length && !error) ?
                        <div className="flex flex-wrap justify-center items-center mt-10">
                            {completedGoals?.slice(0, 4).map((goal, index) => {
                                return (
                                    <div
                                        className={(dark === "light" ?
                                            "w-48 h-48 m-3 rounded-lg bg-gray-100 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                            : "w-48 h-48 m-3 rounded-lg bg-gray-200 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                        )}
                                        key={index}>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-500 text-sm text-left">{goal.title}</span>
                                            <span className="font-semibold text-xs text-violet-500 font-mono">
                                                {`$${parseFloat(goal.currentAmount.toFixed(2))}`}
                                                <span className="font-semibold text-gray-500">
                                                    {` / $${parseFloat(goal.finalAmount.toFixed(2))}`}
                                                </span>
                                            </span>
                                        </div>
                                        <hr />
                                        <div className="mb-6 mt-6" style={{ width: "100%", display: "flex" }}>
                                            <div className="w-full">
                                                <span className="font-semibold text-xs text-gray-500">
                                                    Progress
                                                </span>
                                                <div className="w-full rounded-lg bg-gray-400">
                                                    <div
                                                        className="bg-violet-500 p-0.5 text-center text-xs font-semibold font-mono text-white rounded-lg"
                                                        style={{ width: `${(goal.currentAmount / goal.finalAmount) * 100}%` }}
                                                    >
                                                        {
                                                            !!goal.currentAmount && !!goal.finalAmount ?
                                                            `${((goal.currentAmount / goal.finalAmount) * 100).toFixed(2)}%` : `${(100).toFixed(2)}%`
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            goalLoading[goal.id] ?
                                                <div className="flex justify-center">
                                                    <PulseLoader loading={goalLoading[goal.id]} color="rgb(113, 50, 255)" size={10} />
                                                </div> :
                                                <div className="flex justify-around">
                                                    <div className="w-32 text-center rounded-md bg-green-200">
                                                        <h5
                                                            className="text-lg font-semibold text-center text-green-500 font-mono"
                                                        >
                                                            Completed
                                                        </h5>
                                                    </div>
                                                    <i
                                                        className="fa-solid fa-arrow-up-from-bracket"
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-content="Withdraw"
                                                        onClick={() => handleGoalWithdrawal(goal.id)}
                                                    ></i>
                                                </div>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                        : <div></div>
            }
        </div>
    );
};