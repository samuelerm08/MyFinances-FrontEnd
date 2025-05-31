import { useState } from "react";
import { deleteGoal } from "../../services/myfinances-api/FinancialGoal";
import { HttpStatusCode } from "axios";
import { texts } from "../../constants/MyFinancesConstants";
import Alert from "../Alert";

export const DeleteGoal = ({
    animate,
    setAnimate,
    setPopUp,
    goalId,
    auth,
    activeGoals,
    setActiveGoals,
    setTableGoals,
    balance,
    setBalance
}) => {
    const [alert, setAlert] = useState({});
    const [loading, setLoading] = useState(false);

    const hidePopUp = () => {
        setAnimate(false);
        setTimeout(() => {
            setPopUp(false);
        }, 200);
    };

    const handleGoalDeleting = async (goalId) => {
        setLoading(true);
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            }
        };

        setTimeout(() => {
            setAlert({});
        }, 3000);

        try {
            const { data, status } = await deleteGoal(goalId, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setAlert({
                    msg: "Goal Deleted!",
                    error: false
                });
                setTimeout(() => {
                    setAlert({});
                    const updatedGoals = activeGoals.filter((goal) => goal.id !== data.id);
                    setActiveGoals(updatedGoals);
                    if (setTableGoals) setTableGoals(updatedGoals);
                    if (setBalance) {
                        setBalance({
                            ...balance,
                            totalBalance: balance.totalBalance + data.currentAmount
                        });
                    }
                    hidePopUp();
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
        }
    };
    const { msg } = alert;

    return (
        <div className="modalDelete">
            <div className="modalDeleteContainer shadow-md p-5">
                <div
                    className={`deletePopUp ${animate ? "animate" : "close"}`}
                >
                    <div className="closeDeletePopUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={hidePopUp}></i>
                    </div>

                    <div className='textDelete text-center pb-10 pr-10 pl-10 pt-10 flex flex-col items-center'>
                        <div>
                            <h3 className="text-gray-800 text-lg">
                                {texts.ON_GOAL_DELETING_QUESTION}
                            </h3>
                            <div className="text-center rounded-xl p-3 bg-orange-400 shadow-md hover:shadow-orange-400">
                                <h3 className="text-lg text-gray-800 text-center">
                                    {texts.ON_GOAL_DELETING_WARN}
                                </h3>
                            </div>
                        </div>
                    </div>
                    {msg && <Alert alert={alert} />}
                    <div className="deletePopUpButtons flex flex-row justify-around">
                        <input
                            type="submit"
                            value={"Back"}
                            onClick={hidePopUp}
                            className="backDeleteButton"
                        />

                        <input
                            type="submit"
                            value={!loading ? "Delete" : "Deleting..."}
                            disabled={loading}
                            onClick={() => handleGoalDeleting(goalId)}
                            className="deleteButton"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
