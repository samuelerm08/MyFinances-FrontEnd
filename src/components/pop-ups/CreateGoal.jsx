import { useState } from "react";
import { create, getByState } from "../../services/myfinances-api/financialGoal";
import useAuth from "../../context/useAuth";
import { getUserToken } from "../../services/token/tokenService";
import { amountReGex, errors } from "../../constants/myfinances-constants";
import { HttpStatusCode } from "axios";
import Alert from "../Alert";

const CreateGoal = ({
    setPopUp,
    animate,
    setAnimate,
    setActiveGoals,
    activeGoals,
    tableGoals,
    setTableGoals,
    setActiveGoalsMetadata,
    activeGoalsMetadata
}) => {
    const [alert, setAlert] = useState({});
    const { auth } = useAuth();
    const [goalTitle, setGoalTitle] = useState("");
    const [finalGoal, setFinalGoal] = useState("");
    const [loading, setLoading] = useState(false);

    const hidePopUp = () => {
        setAnimate(false);
        setTimeout(() => {
            setPopUp(false);
        }, 200);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        if ((finalGoal === "" || finalGoal.length === 0) ||
            (goalTitle === "" || goalTitle.length === 0)) {
            setAlert({
                msg: "All fields are required!",
                error: true
            });
            setTimeout(() => {
                setLoading(false);
                setAlert({});
            }, 2000);
            return;
        }

        setTimeout(() => {
            setAlert({});
        }, 3000);

        const user = getUserToken();
        const payload = {
            title: goalTitle,
            finalAmount: parseFloat(finalGoal),
            userId: parseInt(user.id)
        };
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            }
        };

        try {
            const { data, status } = await create(payload, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setAlert({
                    msg: "Goal Created!",
                    error: false
                });
                setTimeout(async () => {
                    setAlert({});
                    !activeGoals.length ? setActiveGoals([data]) : setActiveGoals([data, ...activeGoals]);
                    if (tableGoals) {
                        !tableGoals.length ? setTableGoals([data]) : setTableGoals([data, ...tableGoals]);
                    }

                    if (setActiveGoalsMetadata) {
                        const payload = {
                            userId: user.id,
                            completed: false
                        };
                        const page = activeGoalsMetadata?.page ?? 1;
                        const { data: response, status } = await getByState(payload, page, 4, config);
                        if (status === HttpStatusCode.Ok) setActiveGoalsMetadata(response.meta);
                    }
                    hidePopUp();
                }, 1000);
            }
        } catch (error) {
            if (error.message === errors.badRequests.BAD_REQUEST) {
                setAlert({
                    msg: errors.badRequests.REQUIRED_FIELDS,
                    error: true
                });
                setTimeout(() => {
                    setLoading(false);
                    setAlert({});
                }, 3000);
            }
        }
    };

    const { msg } = alert;

    return (
        <div className="popUp">
            <div className='modalContainer'>
                <form
                    onSubmit={handleSubmit}
                    className={`form ${animate ? "animate" : "close"}`}
                >
                    <div className="close-popUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={hidePopUp}></i>
                    </div>

                    <div className='field'>
                        <label htmlFor="Title">Title</label>
                        <input
                            id="Title"
                            type="text"
                            maxLength={30}
                            placeholder="Goal Title"
                            value={goalTitle}
                            onChange={e => setGoalTitle(e.target.value)}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor="Amount">Amount</label>
                        <input
                            id="Amount"
                            type="text"
                            placeholder="Amount"
                            value={finalGoal.replace(",", ".")}
                            onChange={e => {
                                if (e.target.value === "" || amountReGex.test(e.target.value.replace(",", "."))) {
                                    setFinalGoal(e.target.value);
                                }
                            }}
                        />
                    </div>


                    <input
                        type="submit"
                        value={!loading ? "Create" : "Loading..."}
                        disabled={loading}
                    />
                    {msg && <Alert alert={alert} />}
                </form>
            </div>
        </div>
    );
};

export default CreateGoal;