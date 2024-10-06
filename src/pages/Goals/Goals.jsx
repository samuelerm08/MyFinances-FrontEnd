import { useState } from "react";
import { ActiveGoals } from "../../components/goals/ActiveGoals";
import { CompletedGoals } from "../../components/goals/CompletedGoals";
import { useEffect } from "react";
import { getAll, getByState } from "../../services/myfinances-api/FinancialGoal";
import { getUserToken } from "../../services/token/TokenService";
import useAuth from "../../context/UseAuth";
import Alert from "../../components/Alert";
import { texts } from "../../constants/MyFinancesConstants";
import { GoalsTable } from "../../components/goals/GoalsTable";
import useDark from "../../context/UseDark";
import { HttpStatusCode } from "axios";
import { GoalsPagination } from "../../components/goals/GoalsPagination";
import CreateGoal from "../../components/pop-ups/CreateGoal";

const Goals = () => {
    const { auth } = useAuth();
    const { dark } = useDark();
    const [popUp, setPopUp] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [activeGoals, setActiveGoals] = useState([]);
    const [activeGoalsMetadata, setActiveGoalsMetadata] = useState({});
    const [completedGoals, setCompletedGoals] = useState([]);
    const [completedGoalsMetadata, setCompletedGoalsMetadata] = useState({});
    const [tableGoals, setTableGoals] = useState([]);
    const [tableGoalsMetadata, setTableGoalsMetadata] = useState({});
    const [loadingActiveGoals, setLoadingActiveGoals] = useState(true);
    const [loadingCompletedGoals, setLoadingCompletedGoals] = useState(true);
    const [loadingTableGoals, setLoadingTableGoals] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({});

    const user = getUserToken();
    const handleGoals = () => {
        setPopUp(true);
        setTimeout(() => {
            setAnimate(true);
        }, 400);
    };

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };

    useEffect(() => {
        const fetchActiveGoals = async () => {
            try {
                const activeGoalsPayload = {
                    userId: user.id,
                    completed: false
                };
                const { data: activeGoalsResponse, status: activeGoalsStatus } = await getByState(activeGoalsPayload, 1, 4, config);
                if (activeGoalsStatus === HttpStatusCode.Ok) {
                    setActiveGoals(activeGoalsResponse.data);
                    setActiveGoalsMetadata(activeGoalsResponse.meta);
                    setLoadingActiveGoals(false);
                }
            } catch (error) {
                setError(error);
                setLoadingActiveGoals(false);
                setAlert({
                    msg: texts.WITH_NO_GOALS,
                    warn: true
                });
                setTimeout(() => {
                    setAlert({});
                }, 3000);
            }
        };
        fetchActiveGoals();
    }, []);

    useEffect(() => {
        const fetchCompletedGoals = async () => {
            try {
                const completedGoalsPayload = {
                    userId: user.id,
                    completed: true
                };
                const { data: completedGoalsResponse, status: completedGoalsStatus } = await getByState(completedGoalsPayload, 1, 4, config);
                if (completedGoalsStatus === HttpStatusCode.Ok) {
                    setCompletedGoals(completedGoalsResponse.data);
                    setCompletedGoalsMetadata(completedGoalsResponse.meta);
                    setLoadingCompletedGoals(false);
                }
            } catch (error) {
                setError(error);
                setLoadingCompletedGoals(false);
            }
        };
        fetchCompletedGoals();
    }, []);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const goalsPayload = {
                    userId: user.id
                };
                const { data: goalsResponse, status: goalsStatus } = await getAll(goalsPayload, 1, 10, config);
                if (goalsStatus === HttpStatusCode.Ok) {
                    setTableGoals(goalsResponse.data);
                    setTableGoalsMetadata(goalsResponse.meta);
                    setLoadingTableGoals(false);
                }
            } catch (error) {
                setError(error);
                setLoadingTableGoals(false);
            }
        };
        fetchGoals();
    }, []);

    const { msg } = alert;

    return (
        <div>
            <div className='pt-8 flex justify-between items-center'>
                <button
                    type="button"
                    className='text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold shadow-md hover:shadow-violet-500'
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
                        setTableGoals={setTableGoals}
                        tableGoals={tableGoals}
                        setActiveGoalsMetadata={setActiveGoalsMetadata}
                        activeGoalsMetadata={activeGoalsMetadata}
                    />
                }
                <div className="flex justify-center text-center">
                    {msg && <Alert alert={alert} />}
                </div>
            </div>
            <div className="flex justify-center">
                <div className={(dark === "light" ?
                    "w-2/5 h-1/4 bg-gray-200 p-2 rounded-lg shadow-md hover:shadow-violet-400 m-5 text-center flex flex-col items-center"
                    : "w-2/5 h-1/4 bg-gray-600 p-2 rounded-lg shadow-md hover:shadow-violet-400 m-5 text-center flex flex-col items-center"
                )}>
                    <ActiveGoals
                        goals={activeGoals}
                        auth={auth}
                        error={error}
                        loading={loadingActiveGoals}
                        setLoading={setLoadingActiveGoals}
                        setActiveGoals={setActiveGoals}
                        setCompletedGoals={setCompletedGoals}
                        activeGoalsMetadata={activeGoalsMetadata}
                        completedGoalsMetadata={completedGoalsMetadata}
                        setActiveGoalsMetadata={setActiveGoalsMetadata}
                        setCompletedGoalsMetadata={setCompletedGoalsMetadata}
                        setTableGoals={setTableGoals}
                    />
                    {
                        activeGoalsMetadata.totalCount > 4 ?
                            <div className="w-full">
                                <GoalsPagination
                                    metadata={activeGoalsMetadata}
                                    setMetadata={setActiveGoalsMetadata}
                                    setActiveGoals={setActiveGoals}
                                    isCompleted={false}
                                    setLoading={setLoadingActiveGoals}
                                />
                            </div> : <div></div>
                    }
                </div>

                <div className={(dark === "light" ?
                    "w-2/5 h-1/4 bg-gray-200 p-2 rounded-lg shadow-md hover:shadow-violet-400 m-5 text-center flex flex-col items-center"
                    : "w-2/5 h-1/4 bg-gray-600 p-2 rounded-lg shadow-md hover:shadow-violet-400 m-5 text-center flex flex-col items-center"
                )}>
                    <CompletedGoals
                        goals={completedGoals}
                        error={error}
                        loading={loadingCompletedGoals}
                        completedGoalsMetadata={completedGoalsMetadata}
                        setCompletedGoalsMetadata={setCompletedGoalsMetadata}
                        setCompletedGoals={setCompletedGoals}
                        setTableGoals={setTableGoals}
                        setAlert={setAlert}
                    />
                    {
                        completedGoalsMetadata.totalCount > 4 ?
                            <div className="w-full">
                                <GoalsPagination
                                    metadata={completedGoalsMetadata}
                                    setMetadata={setCompletedGoalsMetadata}
                                    setCompletedGoals={setCompletedGoals}
                                    isCompleted={true}
                                    setLoading={setLoadingCompletedGoals} />
                            </div> : <div></div>
                    }
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className={(dark === "light" ?
                    "bg-inherit p-4 rounded-lg shadow-md hover:shadow-violet-400 w-4/5"
                    :
                    "bg-gray-600 p-4 rounded-lg shadow-md hover:shadow-violet-400 w-4/5"
                )}>
                    <GoalsTable
                        tableGoals={tableGoals}
                        loading={loadingTableGoals} />
                    {
                        tableGoalsMetadata.totalCount > 10 ?
                            <div className="w-full">
                                <GoalsPagination
                                    metadata={tableGoalsMetadata}
                                    setMetadata={setTableGoalsMetadata}
                                    setTableGoals={setTableGoals}
                                    comesFromTable={true}
                                    setLoading={setLoadingTableGoals}
                                />
                            </div> : <div></div>
                    }
                </div>
            </div>
        </div>
    );
};
export default Goals;