import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { texts } from "../../constants/MyFinancesConstants";
import useDark from "../../context/UseDark";
import { ModifyGoal } from "../pop-ups/ModifyGoal";
import { DeleteGoal } from "../pop-ups/DeleteGoal";
import CreateGoal from "../pop-ups/CreateGoal";

export const LastGoal = ({
    activeGoals,
    auth,
    loading,
    setActiveGoals,
    setBalance,
    balance,
    setTransactions
}) => {
    const orderedList = activeGoals?.sort((a, b) => {
        const percentageA = a.currentAmount / a.finalAmount;
        const percentageB = b.currentAmount / b.finalAmount;
        return percentageB - percentageA;
    });
    const almostCompletedGoal = orderedList?.filter((g) => !g.completed);
    const [popUp, setPopUp] = useState(false);
    const [modifyPopUp, setModifyPopUp] = useState(false);
    const [deletePopUp, setDeletingPopUp] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [goalId, setGoalId] = useState(0);
    const [toModifyGoal, setGoal] = useState({});
    const { dark } = useDark();

    const handleGoalModifying = (goalId, goal) => {
        setModifyPopUp(true);
        setGoalId(goalId);
        setGoal(goal)
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };

    const handleGoalDeleting = (goalId) => {
        setDeletingPopUp(true);
        setGoalId(goalId);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };

    const handleGoals = () => {
        setPopUp(true);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };
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
                    !!almostCompletedGoal?.length ?
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex justify-between items-center">
                                <h3 className={(dark === "light" ?
                                    "text-xl font-semibold text-violet-600 antialiased"
                                    : "text-xl font-semibold text-violet-400 antialiased"
                                )}>
                                    Goal to complete
                                </h3>
                                <i className="fa-solid fa-circle-question ml-2 text-gray-400"
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Information based on the last 10 active goals.">
                                </i>
                            </div>
                            <div
                                className={(dark === "light" ?
                                    "w-52 h-52 m-3 rounded-lg bg-gray-100 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                    : "w-52 h-52 m-3 rounded-lg bg-gray-200 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                )}>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-500">{almostCompletedGoal[0].title}</span>
                                    <span className="font-semibold text-xs text-violet-500 font-mono">
                                        {
                                            !almostCompletedGoal[0]?.currentAmount ?
                                                "$0" :
                                                `$${parseFloat(almostCompletedGoal[0].currentAmount.toFixed(2))}`
                                        }
                                        <span className="font-semibold text-xs text-gray-500">
                                            {` / $${parseFloat(almostCompletedGoal[0].finalAmount.toFixed(2))}`}
                                        </span>
                                    </span>
                                </div>
                                <hr />
                                <div className="mb-6 mt-6 flex flex-col text-center" style={{ width: "100%", display: "flex" }}>
                                    <div className="w-full">
                                        <span className="font-semibold text-xs text-gray-500">
                                            Progress
                                        </span>
                                        <div className="w-full rounded-lg bg-gray-400">
                                            {
                                                !almostCompletedGoal[0]?.currentAmount ?
                                                    <div
                                                        className="bg-violet-500 p-0.5 text-center text-xs font-semibold font-mono text-white rounded-lg"
                                                        style={{ width: `${(0 / almostCompletedGoal[0].finalAmount) * 100}%` }}
                                                    >
                                                        {`${(0 / almostCompletedGoal[0].finalAmount) * 100}%`}
                                                    </div> :
                                                    <div
                                                        className="bg-violet-500 p-0.5 text-center text-xs font-semibold font-mono text-white rounded-lg"
                                                        style={{ width: `${(almostCompletedGoal[0].currentAmount / almostCompletedGoal[0].finalAmount) * 100}%` }}
                                                    >
                                                        {`${((almostCompletedGoal[0].currentAmount / almostCompletedGoal[0].finalAmount) * 100).toFixed(3)}%`}
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
                                            onClick={() => handleGoalModifying(almostCompletedGoal[0]?.id, almostCompletedGoal[0])}>
                                        </i>
                                    </button>
                                    {modifyPopUp &&
                                        <ModifyGoal
                                            setPopUp={setModifyPopUp}
                                            animate={animate}
                                            setAnimate={setAnimate}
                                            goalId={goalId}
                                            goal={toModifyGoal}
                                            auth={auth}
                                            setActiveGoals={setActiveGoals}
                                            setBalance={setBalance}
                                            balance={balance}
                                            setTransactions={setTransactions}
                                        />
                                    }

                                    <button>
                                        <i className="fa-solid fa-trash"
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Delete Goal"
                                            onClick={() => handleGoalDeleting(almostCompletedGoal[0]?.id)}>
                                        </i>
                                    </button>
                                    {deletePopUp &&
                                        <DeleteGoal
                                            setPopUp={setDeletingPopUp}
                                            animate={animate}
                                            setAnimate={setAnimate}
                                            goalId={goalId}
                                            auth={auth}
                                            activeGoals={orderedList}
                                            setActiveGoals={setActiveGoals}
                                            balance={balance}
                                            setBalance={setBalance}
                                        />
                                    }
                                </div>
                            </div>
                        </div> :
                        <div className='pt-14 flex flex-col p-5 items-center text-center'>
                            <h3 className={(dark === "light" ?
                                "mb-10 text-lg text-center mt-20 text-black" :
                                "mb-10 text-lg text-center mt-20 text-white")}>
                                {texts.WITH_NO_GOALS}
                            </h3>
                            <button
                                type="button"
                                className='text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold p-absolute shadow-md hover:shadow-violet-500'
                                onClick={handleGoals}
                            >
                                New Goal
                            </button>

                            {popUp &&
                                <CreateGoal
                                    setPopUp={setPopUp}
                                    animate={animate}
                                    setAnimate={setAnimate}
                                    setActiveGoals={setActiveGoals}
                                    activeGoals={activeGoals}
                                />
                            }
                        </div>
            }
        </div>
    );
};