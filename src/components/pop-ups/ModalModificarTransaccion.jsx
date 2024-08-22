import { useState } from "react";
import { modifyTransaction } from "../../services/myfinances-api/transaction";
import { amountReGex, errors, textsReGex } from "../../constants/myfinances-constants";
import Alert from "../Alert";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { getUserToken } from "../../services/token/tokenService";
import useAuth from "../../context/useAuth";
import { HttpStatusCode } from "axios";

export const ModificarTransaccion = ({
    animarModal,
    setAnimarModal,
    setModal,
    transaccionId,
    transaction,
    setTransaccion,
    setTransacciones,
    balance,
    categories
}) => {
    const { auth } = useAuth();
    const [alert, setAlerta] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setFecha] = useState(new Date(transaction.date).toISOString().substring(0,10));
    const [details, setDetalle] = useState(transaction.details);
    const [amount, setMonto] = useState(transaction.amount);
    const [transactionType, setTipoTransaccion] = useState(transaction.transactionType);
    const [categoriaId, setCategoria] = useState(transaction?.categoria?.id ?? transaction?.cat_Id);
    const user = getUserToken();
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };

    const ocultarModal = () => {
        setAnimarModal(false);
        setTimeout(() => {
            setModal(false);
        }, 200);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        if ([details, amount].length === 0) {
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            });
        }

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        const payload = {
            id: transaccionId,
            date: date,
            details: details,
            amount: parseFloat(amount),
            transactionType: transactionType,
            cat_Id: parseInt(categoriaId),
            balance_Id: parseInt(balance?.id) ?? null,
            usuarioId: parseInt(user.id),
            isActive: true
        };

        try {
            const { data, status } = await modifyTransaction(transaccionId, payload, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setAlerta({
                    msg: "Transaccion Modificada!",
                    error: false
                });
                setTimeout(() => {
                    setAlerta({});
                    setTransaccion(data);
                    setTransacciones(transactions => transactions.map((transaction) =>
                        transaction.id === transaccionId ? data : transaction
                    ));
                    ocultarModal();
                }, 1500);
            }
        } catch (error) {
            if (!error.errors) {
                if (error.message === errors.badRequests.BAD_REQUEST) {
                    setAlerta({
                        msg: errors.badRequests.REQUIRED_FIELDS,
                        error: true
                    });
                    setTimeout(() => {
                        setLoading(false);
                        setAlerta({});
                    }, 3000);
                }
            }
            else {
                if (error.status === errors.badRequests.BAD_REQUEST_CODE) {
                    setAlerta({
                        msg: errors.badRequests.REQUIRED_FIELDS,
                        error: true
                    });
                    setTimeout(() => {
                        setLoading(false);
                        setAlerta({});
                    }, 3000);
                }
            }
        }
    };

    const { msg } = alert;
    return (
        <div className="popUp">
            <div className='modalContainer'>
                <form
                    onSubmit={handleSubmit}
                    className={`form ${animarModal ? "animate" : "close"}`}
                >
                    <div className="close-popUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={ocultarModal}></i>
                    </div>

                    <div className='field'>
                        <label htmlFor="Date">Date</label>
                        <ReactDatePicker
                            locale={es}
                            className="bg-[#E5E7EB] rounded-md p-1"
                            value={date}
                            placeholderText="Date"
                            onChange={(date) => setFecha(date.toISOString().split("T")[0])}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor="details">Details</label>
                        <input
                            id="details"
                            type="text"
                            placeholder="Details"
                            maxLength={80}
                            value={details}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setDetalle(e.target.value);
                                }
                            }}
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="amount">Amount</label>
                        <input
                            id="amount"
                            type="text"
                            placeholder="Ingresar amount"
                            value={amount.toString().replace(",", ".")}
                            onChange={e => {
                                if (e.target.value === "" || amountReGex.test(e.target.value.replace(",", "."))) {
                                    setMonto(e.target.value);
                                }
                            }}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor="transactionType">Type de Transaction</label>
                        <select name="transactionType" id="transactionType" value={transactionType}
                            onChange={e => setTipoTransaccion(e.target.value)}
                        >
                            <option defaultValue={"Ingreso"} value="Ingreso">Ingreso</option>
                            <option value="Egreso">Egreso</option>
                        </select>
                    </div>

                    <div className='field'>
                        <label htmlFor="categoria">Categoria</label>
                        <select name="categoria" id="categoria" value={categoriaId}
                            onChange={e => setCategoria(e.target.value)}
                        >
                            {
                                categories?.map((c, index) => {
                                    return (
                                        <option
                                            defaultValue={c.id}
                                            value={c.id}
                                            key={index}>
                                            {c.title}
                                        </option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <input
                        type="submit"
                        value={!loading ? "Enviar" : "Enviando..."}
                        disabled={loading}
                    />

                    {msg && <Alert alert={alert} />}

                </form>
            </div>
        </div>
    );
};