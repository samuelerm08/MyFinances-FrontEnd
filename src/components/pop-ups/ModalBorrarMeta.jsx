import { useState } from "react";
import Alerta from "../Alerta";
import { deleteGoal, getByState } from "../../services/myfinances-api/metaFinanciera";
import { HttpStatusCode } from "axios";
import { texts } from "../../constants/myfinances-constants";
import { getUserToken } from "../../services/token/tokenService";

export const DeleteGoal = ({
    animarModal,
    setAnimarModal,
    setModal,
    goalId,
    auth,
    setActiveGoals,
    setTableGoals
}) => {
    const [alerta, setAlerta] = useState({});
    const [loading, setLoading] = useState(false);

    const ocultarModal = () => {
        setAnimarModal(false);
        setTimeout(() => {
            setModal(false);
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
            setAlerta({});
        }, 3000);

        try {
            const { data, status } = await deleteGoal(goalId, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setAlerta({
                    msg: "Meta Eliminada!",
                    error: false
                });
                setTimeout(() => {
                    setAlerta({});
                    setActiveGoals(goals => goals.filter((goal) => goal.id !== data.id));
                    if (setTableGoals) {
                        setTableGoals(goals => goals.filter((goal) => goal.id !== data.id));
                    }
                    ocultarModal();
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    const { msg } = alerta;

    return (
        <div className="modalDelete">
            <div className="modalDeleteContainer shadow-md p-5">
                <div
                    className={`deletePopUp ${animarModal ? "animar" : "cerrar"}`}
                >
                    <div className="closeDeletePopUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={ocultarModal}></i>
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
                    {msg && <Alerta alerta={alerta} />}
                    <div className="deletePopUpButtons flex flex-row justify-around">
                        <input
                            type="submit"
                            value={"Volver"}
                            onClick={ocultarModal}
                            className="backDeleteButton"
                        />

                        <input
                            type="submit"
                            value={!loading ? "Eliminar" : "Eliminando..."}
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
