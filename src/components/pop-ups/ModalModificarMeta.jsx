import { HttpStatusCode } from "axios";
import { amountReGex, textsReGex, type } from "../../constants/myfinances-constants";
import { getByState, modifyGoal } from "../../services/myfinances-api/metaFinanciera";
import Alerta from "../Alerta";
import { useState } from "react";
import { getUserToken } from "../../services/token/tokenService";

export const ModifyGoal = ({
    animarModal,
    setAnimarModal,
    setModal,
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
    setTransacciones
}) => {
    const [alerta, setAlerta] = useState({});
    const [title, setTitle] = useState(goal.titulo ?? "");
    const [currentAmount, setCurrentAmount] = useState(goal.montoActual ?? "");
    const [finalAmount, setFinalAmount] = useState(goal.montoFinal ?? "");
    const [cargando, setLoading] = useState(false);
    const user = getUserToken();

    const ocultarModal = () => {
        setAnimarModal(false);
        setTimeout(() => {
            setModal(false);
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
            setAlerta({});
        }, 3000);

        const payload = {
            id: goalId,
            titulo: title,
            montoActual: !!currentAmount ? parseFloat(currentAmount) : 0,
            montoFinal: !!finalAmount ? parseFloat(finalAmount) : 0
        };

        try {
            const { data, status } = await modifyGoal(goalId, payload, config);
            if (status === HttpStatusCode.Ok) {
                const isLower = goal.montoActual > parseFloat(currentAmount);
                const amountDiff = goal.montoActual - parseFloat(currentAmount);
                const amountToDiscount = amountDiff > 0 ? amountDiff : -amountDiff;
                setLoading(false);
                setAlerta({
                    msg: "Meta Modificada!",
                    error: false
                });
                setTimeout(() => {
                    setAlerta({});
                    setActiveGoals(activeGoals => activeGoals.map((goal) => {
                        return goal.id === goalId ? {
                            ...goal,
                            titulo: data.titulo,
                            montoActual: data.montoActual,
                            montoFinal: data.montoFinal
                        } : goal;
                    }));
                    if (setTableGoals) {
                        setTableGoals(tableGoals => tableGoals.map((goal) => {
                            return goal.id === goalId ? {
                                ...goal,
                                titulo: data.titulo,
                                montoActual: data.montoActual,
                                montoFinal: data.montoFinal
                            } : goal;
                        }))
                    }
                    if (setBalance) {
                        if (!balance.saldo_Total) {
                            setBalance({
                                ...balance,
                                saldo_Total: parseFloat(amountToDiscount) * -1
                            });
                        }
                        else {
                            if (!!amountToDiscount) {
                                setBalance({
                                    ...balance,
                                    saldo_Total: !isLower ?
                                        balance.saldo_Total - parseFloat(amountToDiscount) :
                                        balance.saldo_Total + parseFloat(amountToDiscount)
                                });
                            }
                        }
                    }
                    if (setTransacciones) {
                        if (!!amountToDiscount) {
                            const goalTransaction = {
                                detalle: !isLower ?
                                    `Modificacion/Monto Mayor - Meta: ${data.titulo}` :
                                    `Modificacion/Monto Menor - Meta: ${data.titulo}`,
                                monto: parseFloat(amountToDiscount),
                                fecha: new Date(),
                                tipoTransaccion: type.RESERVA
                            };
                            setTransacciones(transacciones => [
                                goalTransaction,
                                ...transacciones
                            ]);
                        }
                    }
                    if (data.completada) {
                        setTimeout(async () => {
                            setActiveGoals(activeGoals => activeGoals.map((goal) => {
                                return goal.id === goalId ? { ...goal, completada: data.completada } : goal;
                            }));
                            if (setTableGoals) {
                                setTableGoals(setTableGoals => setTableGoals.map((goal) => {
                                    return goal.id === goalId ? { ...goal, completada: data.completada } : goal;
                                }));
                            }
                            if (setCompletedGoals) {
                                setCompletedGoals(completedGoals => [data, ...completedGoals]);
                                const payload = {
                                    userId: user.id,
                                    completada: true
                                };
                                let page = completedGoalsMetadata?.page ?? 1;
                                const resetPageEnabled =
                                    page !== 1 &&
                                    (
                                        !completedGoalsMetadata?.hasNextPage &&
                                        lastGoalIndex === 0
                                    );
                                if (resetPageEnabled) {
                                    page = page - 1;
                                }
                                const { data: response, status } = await getByState(payload, page, 4, config);
                                if (status === HttpStatusCode.Ok) {
                                    setCompletedGoalsMetadata(response.meta);
                                }
                            }
                            if (setActiveGoalsMetadata) {
                                const payload = {
                                    userId: user.id,
                                    completada: false
                                };
                                let page = activeGoalsMetadata?.page ?? 1;
                                const resetPageEnabled =
                                    page !== 1 &&
                                    (
                                        !activeGoalsMetadata?.hasNextPage &&
                                        lastGoalIndex === 0
                                    );
                                if (resetPageEnabled) {
                                    page = page - 1;
                                }
                                const { data: response, status } = await getByState(payload, page, 4, config);
                                if (status === HttpStatusCode.Ok) {
                                    setActiveGoals(response.data);
                                    setActiveGoalsMetadata(response.meta);
                                }
                            }
                        }, 100);
                    }
                    ocultarModal();
                }, 1500);
            }
        } catch (error) {
            setLoading(false);
            if (currentAmount > finalAmount) {
                setAlerta({
                    msg: "El monto actual no puede ser mayor al monto final",
                    error: true
                });
            }
            console.log(error);
        }
    };
    const { msg } = alerta;

    return (
        <div className="modal">
            <div className="modalContainer">
                <form
                    onSubmit={handleAdding}
                    className={`formulario ${animarModal ? "animar" : "cerrar"}`}
                >
                    <div className="cerrar-modal">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={ocultarModal}></i>
                    </div>

                    <div className='campo'>
                        <label htmlFor="Titulo">Titulo</label>
                        <input
                            id="Titulo"
                            type="text"
                            maxLength={30}
                            placeholder="Titulo de la meta"
                            value={title}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setTitle(e.target.value);
                                }
                            }}
                        />
                    </div>

                    <div className='campo'>
                        <label htmlFor="Monto Actual">Monto Actual</label>
                        <input
                            id="MontoActual"
                            type="text"
                            placeholder="Monto Actual"
                            value={currentAmount.toString().replace(",", ".")}
                            onChange={e => {
                                if (e.target.value === "" || amountReGex.test(e.target.value.replace(",", "."))) {
                                    setCurrentAmount(e.target.value);
                                }
                            }}
                        />
                    </div>

                    <div className='campo'>
                        <label htmlFor="Monto Final">Monto Final</label>
                        <input
                            id="MontoFinal"
                            type="text"
                            placeholder="Monto Final"
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
                        value={!cargando ? "Modificar" : "Modificando..."}
                        disabled={cargando}
                    />
                    {msg && <Alerta alerta={alerta} />}
                </form>
            </div>
        </div>
    );
};
