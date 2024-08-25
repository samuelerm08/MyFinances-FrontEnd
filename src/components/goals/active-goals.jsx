import { useState } from "react";
import { PulseLoader } from "react-spinners";
import useDark from "../../context/useDark";
import { ModifyGoal } from "../pop-ups/ModifyGoal";
import { DeleteGoal } from "../pop-ups/DeleteGoal";

export const ActiveGoals = ({
    goals,
    auth,
    error,
    loading,
    setActiveGoals,
    setCompletedGoals,
    setCompletedGoalsMetadata,
    activeGoalsMetadata,
    completedGoalsMetadata,
    setTableGoals,
    setActiveGoalsMetadata
}) => {
    const activeGoals = goals?.filter(({ completed }) => !completed);
    const [animate, setAnimate] = useState(false);
    const [goalId, setGoalId] = useState(0);
    const [modifyModal, setModifyPopUp] = useState(false);
    const [deleteModal, setDeletePopUp] = useState(false);
    const [goalToModify, setGoal] = useState({});
    const { dark } = useDark();

    const handleGoalModifying = (goalId, goal) => {
        setModifyPopUp(true);
        setGoalId(goalId);
        setGoal(goal)
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };

    const handleGoalDeleting = goalId => {
        setDeletePopUp(true);
        setGoalId(goalId);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };

    return (
        <div className="t-table">
            <h3 className={(dark === "light" ?
                "text-xl font-semibold text-violet-600 antialiased"
                : "text-xl font-semibold text-violet-400 antialiased"
            )}>Active Goals</h3>

            {
                !!loading ?
                    <div className="flex justify-center items-center h-full">
                        <PulseLoader loading={loading} color="rgb(113, 50, 255)" size={10} />
                    </div> :
                    !!goals?.length || (!!goals?.length && !error) ?
                        <div className="flex flex-wrap justify-center mt-10">
                            {activeGoals?.splice(0, 4).map((goal, index) => {
                                return (
                                    <div
                                        className={(dark === "light" ?
                                            "w-48 h-48 m-3 rounded-lg bg-gray-100 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                            : "w-48 h-48 m-3 rounded-lg bg-gray-200 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                        )}
                                        key={index}>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-500">{goal.title}</span>
                                            <span className="font-semibold text-xs text-violet-500 font-mono">
                                                {
                                                    !goal.currentAmount ?
                                                        "$0" :
                                                        `$${parseFloat(goal.currentAmount.toFixed(2))}`
                                                }
                                                <span className="font-semibold text-xs text-gray-500">
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
                                                    {
                                                        !goal.currentAmount ?
                                                            <div
                                                                className="bg-violet-500 p-0.5 text-center text-xs font-semibold font-mono text-white rounded-lg"
                                                                style={{ width: `${(0 / goal.finalAmount) * 100}%` }}
                                                            >
                                                                {`${(0 / goal.finalAmount) * 100}%`}
                                                            </div> :
                                                            <div
                                                                className="bg-violet-500 p-0.5 text-center text-xs font-semibold font-mono text-white rounded-lg"
                                                                style={{ width: `${((goal.currentAmount / goal.finalAmount) * 100).toFixed(2)}%` }}
                                                            >
                                                                {`${((goal.currentAmount / goal.finalAmount) * 100).toFixed(3)}%`}
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-around">
                                            <button>
                                                <i className="fa-regular fa-pen-to-square"
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="Modify Goal"
                                                    onClick={() => handleGoalModifying(goal.id, goal)}>
                                                </i>
                                            </button>
                                            {modifyModal &&
                                                <ModifyGoal
                                                    setPopUp={setModifyPopUp}
                                                    animate={animate}
                                                    setAnimate={setAnimate}
                                                    goalId={goalId}
                                                    goal={goalToModify}
                                                    auth={auth}
                                                    setActiveGoals={setActiveGoals}
                                                    lastGoalIndex={index}
                                                    activeGoalsMetadata={activeGoalsMetadata}
                                                    setActiveGoalsMetadata={setActiveGoalsMetadata}
                                                    setCompletedGoals={setCompletedGoals}
                                                    completedGoalsMetadata={completedGoalsMetadata}
                                                    setCompletedGoalsMetadata={setCompletedGoalsMetadata}
                                                    setTableGoals={setTableGoals}
                                                />
                                            }
                                            <button>
                                                <i className="fa-solid fa-trash"
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-content="Delete"
                                                    onClick={() => handleGoalDeleting(goal.id)}>
                                                </i>
                                            </button>
                                            {deleteModal &&
                                                <DeleteGoal
                                                    setPopUp={setDeletePopUp}
                                                    animate={animate}
                                                    setAnimate={setAnimate}
                                                    goalId={goalId}
                                                    auth={auth}
                                                    activeGoals={activeGoals}
                                                    setActiveGoals={setActiveGoals}
                                                    setTableGoals={setTableGoals}
                                                    setActiveGoalsMetadata={setActiveGoalsMetadata}
                                                />
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div> :
                        <div></div>
            }
        </div>
    );
};