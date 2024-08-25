import { HttpStatusCode } from "axios";
import { amountReGex, textsReGex, type } from "../../constants/myfinances-constants";
import { getByState, modifyGoal } from "../../services/myfinances-api/financialGoal";
import { useState } from "react";
import { getUserToken } from "../../services/token/tokenService";
import Alert from "../Alert";

export const ModifyGoal = ({
    animate,
    setAnimate,
    setPopUp,
    goalId,
    goal,
    auth,
    setActiveGoals,
    lastGoalIndex,
    setCompletedGoals,
    setTableGoals,
    activeGoalsMetadata,
    completedGoalsMetadata,
    setActiveGoalsMetadata,
    setCompletedGoalsMetadata,
    setBalance,
    balance,
    setTransactions
}) => {
    const [alert, setAlert] = useState({});
    const [title, setTitle] = useState(goal.title ?? "");
    const [currentAmount, setCurrentAmount] = useState(goal.currentAmount ?? "");
    const [finalAmount, setFinalAmount] = useState(goal.finalAmount ?? "");
    const [loading, setLoading] = useState(false);
    const user = getUserToken();

    const hidePopUp = () => {
        setAnimate(false);
        setTimeout(() => {
            setPopUp(false);
        }, 200);
    };

    const handleAdding = async e => {
        e.preventDefault();
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

        const payload = {
            id: goalId,
            title: title,
            currentAmount: !!currentAmount ? parseFloat(currentAmount) : 0,
            finalAmount: !!finalAmount ? parseFloat(finalAmount) : 0
        };

        try {
            const { data, status } = await modifyGoal(goalId, payload, config);
            if (status === HttpStatusCode.Ok) {
                const isLower = goal.currentAmount > parseFloat(currentAmount);
                const amountDiff = goal.currentAmount - parseFloat(currentAmount);
                const amountToDiscount = amountDiff > 0 ? amountDiff : -amountDiff;
                setLoading(false);
                setAlert({
                    msg: "Goal Modified!",
                    error: false
                });
                setTimeout(() => {
                    setAlert({});
                    setActiveGoals(activeGoals => activeGoals.map((goal) => {
                        return goal.id === goalId ? {
                            ...goal,
                            title: data.title,
                            currentAmount: data.currentAmount,
                            finalAmount: data.finalAmount
                        } : goal;
                    }));
                    if (setTableGoals) {
                        setTableGoals(tableGoals => tableGoals.map((goal) => {
                            return goal.id === goalId ? {
                                ...goal,
                                title: data.title,
                                currentAmount: data.currentAmount,
                                finalAmount: data.finalAmount
                            } : goal;
                        }))
                    }
                    if (setBalance) {
                        if (!balance.totalBalance) {
                            setBalance({
                                ...balance,
                                totalBalance: parseFloat(amountToDiscount) * -1
                            });
                        }
                        else {
                            if (!!amountToDiscount) {
                                setBalance({
                                    ...balance,
                                    totalBalance: !isLower ?
                                        balance.totalBalance - parseFloat(amountToDiscount) :
                                        balance.totalBalance + parseFloat(amountToDiscount)
                                });
                            }
                        }
                    }
                    if (setTransactions) {
                        if (!!amountToDiscount) {
                            const goalTransaction = {
                                details: !isLower ?
                                    `Update/Greater amount - Goal: ${data.title}` :
                                    `Update/Lower amount - Goal: ${data.title}`,
                                amount: parseFloat(amountToDiscount),
                                date: new Date(),
                                transactionType: type.RESERVE
                            };
                            setTransactions(transactions => [
                                goalTransaction,
                                ...transactions
                            ]);
                        }
                    }
                    if (data.completed) {
                        setTimeout(async () => {
                            setActiveGoals(activeGoals => activeGoals.map((goal) => {
                                return goal.id === goalId ? { ...goal, completed: data.completed } : goal;
                            }));
                            if (setTableGoals) {
                                setTableGoals(setTableGoals => setTableGoals.map((goal) => {
                                    return goal.id === goalId ? { ...goal, completed: data.completed } : goal;
                                }));
                            }
                            if (setCompletedGoals) {
                                setCompletedGoals(completedGoals => [data, ...completedGoals]);
                                const payload = {
                                    userId: user.id,
                                    completed: true
                                };

                                let page = completedGoalsMetadata?.page ?? 1;
                                const resetPageEnabled =
                                    page !== 1 && (!completedGoalsMetadata?.hasNextPage && lastGoalIndex === 0);

                                if (resetPageEnabled) page = page - 1;

                                const { data: response, status } = await getByState(payload, page, 4, config);
                                if (status === HttpStatusCode.Ok) setCompletedGoalsMetadata(response.meta);
                            }
                            if (setActiveGoalsMetadata) {
                                const payload = {
                                    userId: user.id,
                                    completed: false
                                };

                                let page = activeGoalsMetadata?.page ?? 1;
                                const resetPageEnabled =
                                    page !== 1 && (!activeGoalsMetadata?.hasNextPage && lastGoalIndex === 0);

                                if (resetPageEnabled) page = page - 1;

                                const { data: response, status } = await getByState(payload, page, 4, config);
                                if (status === HttpStatusCode.Ok) {
                                    setActiveGoals(response.data);
                                    setActiveGoalsMetadata(response.meta);
                                }
                            }
                        }, 100);
                    }
                    hidePopUp();
                }, 1500);
            }
        } catch (error) {
            setLoading(false);
            if (currentAmount > finalAmount) {
                setAlert({
                    msg: "The current amount cannot be greater than the final amount",
                    error: true
                });
            }
        }
    };
    const { msg } = alert;
    return (
        <div className="popUp">
            <div className="modalContainer">
                <form
                    onSubmit={handleAdding}
                    className={`form ${animate ? "animate" : "close"}`}
                >
                    <div className="close-popUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={hidePopUp}></i>
                    </div>

                    <div className='field'>
                        <label htmlFor="Ti">Title</label>
                        <input
                            id="Title"
                            type="text"
                            maxLength={30}
                            placeholder="Goal title"
                            value={title}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setTitle(e.target.value);
                                }
                            }}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor="Current Amount">Current Amount</label>
                        <input
                            id="CurrentAmount"
                            type="text"
                            placeholder="Current Amount"
                            value={currentAmount.toString().replace(",", ".")}
                            onChange={e => {
                                if (e.target.value === "" || amountReGex.test(e.target.value.replace(",", "."))) {
                                    setCurrentAmount(e.target.value);
                                }
                            }}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor="Final Amount">Final Amount</label>
                        <input
                            id="FinalAmount"
                            type="text"
                            placeholder="Final Amount"
                            value={finalAmount.toString().replace(",", ".")}
                            onChange={e => {
                                if (e.target.value === "" || amountReGex.test(e.target.value.replace(",", "."))) {
                                    setFinalAmount(e.target.value);
                                }
                            }}
                        />
                    </div>

                    <input
                        type="submit"
                        value={!loading ? "Submit" : "Loading..."}
                        disabled={loading}
                    />
                    {msg && <Alert alert={alert} />}
                </form>
            </div>
        </div>
    );
};
