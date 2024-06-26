import { useState } from "react";
import { PulseLoader } from "react-spinners";
import ModalMetas from "../pop-ups/ModalMetas";
import { texts } from "../../constants/myfinances-constants";
import useDark from "../../context/useDark";
import { ModifyGoal } from "../pop-ups/ModalModificarMeta";

export const LastGoal = ({
    activeGoals,
    auth,
    cargando,
    setActiveGoals,
    setBalance,
    balance,
    setTransacciones
}) => {
    const orderedList = activeGoals?.sort((a, b) => {
        const percentageA = a.montoActual / a.montoFinal;
        const percentageB = b.montoActual / b.montoFinal;
        return percentageB - percentageA;
    });
    const almostCompletedGoal = orderedList?.filter((g) => !g.completada);
    const [modal, setModal] = useState(false);
    const [modifyModal, setModifyModal] = useState(false);
    const [animarModal, setAnimarModal] = useState(false);
    const [goalId, setGoalId] = useState(0);
    const [toModifyGoal, setGoal] = useState({});
    const { dark } = useDark();

    const handleGoalModifying = (goalId, goal) => {
        setModifyModal(true);
        setGoalId(goalId);
        setGoal(goal)
        setTimeout(() => {
            setAnimarModal(true);
        }, 400);
    };

    const handleGoals = () => {
        setModal(true);
        setTimeout(() => {
            setAnimarModal(true);
        }, 400);
    };
    return (
        <div className={(dark === "light" ?
            "bg-gray-200 pt-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 w-full m-2 flex flex-col justify-around"
            : "bg-gray-600 pt-4 rounded-lg shadow-md transition ease-in duration-300 hover:shadow-violet-400 w-full m-2 flex flex-col justify-around"
        )}
        >
            {
                cargando ?
                    <div className="flex justify-center">
                        <PulseLoader loading={cargando} color="rgb(113, 50, 255)" size={10} />
                    </div> :
                    !!almostCompletedGoal?.length ?
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex justify-between items-center">
                                <h3 className={(dark === "light" ?
                                    "text-xl font-semibold text-violet-600 antialiased"
                                    : "text-xl font-semibold text-violet-400 antialiased"
                                )}>
                                    Meta a completar
                                </h3>
                                <i className="fa-solid fa-circle-question ml-2 text-gray-400"
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Información basada en las últimas 10 metas activas.">
                                </i>
                            </div>
                            <div
                                className={(dark === "light" ?
                                    "w-52 h-52 m-3 rounded-lg bg-gray-100 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                    : "w-52 h-52 m-3 rounded-lg bg-gray-200 p-3 w-50% shadow-md hover:shadow-violet-400 dark:bg-neutral-700 duration-100"
                                )}>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-500">{almostCompletedGoal[0].titulo}</span>
                                    <span className="font-semibold text-xs text-violet-500 font-mono">
                                        {
                                            !almostCompletedGoal[0]?.montoActual ?
                                                "$0" :
                                                `$${parseFloat(almostCompletedGoal[0].montoActual.toFixed(2))}`
                                        }
                                        <span className="font-semibold text-xs text-gray-500">
                                            {` / $${parseFloat(almostCompletedGoal[0].montoFinal.toFixed(2))}`}
                                        </span>
                                    </span>
                                </div>
                                <hr />
                                <div className="mb-6 mt-6 flex flex-col text-center" style={{ width: "100%", display: "flex" }}>
                                    <div className="w-full">
                                        <span className="font-semibold text-xs text-gray-500">
                                            Progreso
                                        </span>
                                        <div className="w-full rounded-lg bg-gray-400">
                                            {
                                                !almostCompletedGoal[0]?.montoActual ?
                                                    <div
                                                        className="bg-violet-500 p-0.5 text-center text-xs font-semibold font-mono text-white rounded-lg"
                                                        style={{ width: `${(0 / almostCompletedGoal[0].montoFinal) * 100}%` }}
                                                    >
                                                        {`${(0 / almostCompletedGoal[0].montoFinal) * 100}%`}
                                                    </div> :
                                                    <div
                                                        className="bg-violet-500 p-0.5 text-center text-xs font-semibold font-mono text-white rounded-lg"
                                                        style={{ width: `${(almostCompletedGoal[0].montoActual / almostCompletedGoal[0].montoFinal) * 100}%` }}
                                                    >
                                                        {`${((almostCompletedGoal[0].montoActual / almostCompletedGoal[0].montoFinal) * 100).toFixed(3)}%`}
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-around">
                                    <button>
                                        <i className="fa-regular fa-pen-to-square"
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Modificar Meta"
                                            onClick={() => handleGoalModifying(almostCompletedGoal[0]?.id, almostCompletedGoal[0])}>
                                        </i>
                                    </button>
                                    {modifyModal &&
                                        <ModifyGoal
                                            setModal={setModifyModal}
                                            animarModal={animarModal}
                                            setAnimarModal={setAnimarModal}
                                            goalId={goalId}
                                            goal={toModifyGoal}
                                            auth={auth}
                                            setActiveGoals={setActiveGoals}
                                            setBalance={setBalance}
                                            balance={balance}
                                            setTransacciones={setTransacciones}
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
                                Nueva Meta
                            </button>

                            {modal &&
                                <ModalMetas
                                    setModal={setModal}
                                    animarModal={animarModal}
                                    setAnimarModal={setAnimarModal}
                                    setActiveGoals={setActiveGoals}
                                    activeGoals={activeGoals}
                                />
                            }
                        </div>
            }
        </div>
    );
};